import { useEffect, useState, useCallback } from 'react';
import type { FormInstance } from 'antd';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../db';
import dayjs from 'dayjs';

interface UseOfflineFormOptions {
  formId: string; // Unique identifier for this form instance
  form: FormInstance;
  onLoad?: (data: Record<string, unknown>) => void; // Optional callback when data is loaded
  transformBeforeSave?: (values: Record<string, unknown>) => Record<string, unknown>; // Transform data before saving
  transformAfterLoad?: (data: Record<string, unknown>) => Record<string, unknown>; // Transform data after loading
}

interface UseOfflineFormReturn {
  lastSaved: number | null;
  isSaving: boolean;
  clearFormData: () => Promise<void>;
  saveFormData: (values: Record<string, unknown>) => Promise<void>;
}

/**
 * Custom hook for offline-first form management with Dexie
 * 
 * @param formId - Unique identifier for this form (e.g., 'user-registration', 'contact-form-123')
 * @param form - Ant Design Form instance
 * @param onLoad - Optional callback when saved data is loaded
 * @param transformBeforeSave - Optional function to transform data before saving to Dexie
 * @param transformAfterLoad - Optional function to transform data after loading from Dexie
 * 
 * @example
 * const { form } = Form.useForm();
 * const { lastSaved, clearFormData } = useOfflineForm({
 *   formId: 'user-profile',
 *   form,
 * });
 */
export const useOfflineForm = ({
  formId,
  form,
  onLoad,
  transformBeforeSave,
  transformAfterLoad,
}: UseOfflineFormOptions): UseOfflineFormReturn => {
  const [lastSaved, setLastSaved] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Load saved form data from Dexie for this specific formId
  const savedData = useLiveQuery(async () => {
    const data = await db.formData.where('formId').equals(formId).first();
    return data;
  });

  // Default transform: convert dayjs objects to strings
  const defaultTransformBeforeSave = useCallback((values: Record<string, unknown>) => {
    const transformed: Record<string, unknown> = {};
    
    for (const [key, value] of Object.entries(values)) {
      if (value && typeof value === 'object' && 'format' in value) {
        // Check if it's a dayjs object
        try {
          transformed[key] = (value as { format: (format: string) => string }).format('YYYY-MM-DD');
        } catch {
          transformed[key] = value;
        }
      } else {
        transformed[key] = value;
      }
    }
    
    return transformed;
  }, []);

  // Default transform: convert date strings back to dayjs objects
  const defaultTransformAfterLoad = useCallback((data: Record<string, unknown>) => {
    const transformed: Record<string, unknown> = {};
    
    for (const [key, value] of Object.entries(data)) {
      // Try to detect date strings and convert to dayjs
      if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
        try {
          transformed[key] = dayjs(value);
        } catch {
          transformed[key] = value;
        }
      } else {
        transformed[key] = value;
      }
    }
    
    return transformed;
  }, []);

  // Load saved data when component mounts or when savedData changes
  useEffect(() => {
    if (savedData?.data) {
      console.log("on reload")
      let transformedData = savedData.data;
      
      // Apply custom transform if provided, otherwise use default
      if (transformAfterLoad) {
        transformedData = transformAfterLoad(savedData.data);
      } else {
        transformedData = defaultTransformAfterLoad(savedData.data);
      }
      
      console.log("setting fields", transformedData);
      form.setFieldsValue(transformedData);
      setLastSaved(savedData.updatedAt);
      
      if (onLoad) {
        onLoad(transformedData);
      }
    }
  }, [savedData, form, onLoad, transformAfterLoad, defaultTransformAfterLoad]);

  // Save form data to Dexie
  const saveFormData = useCallback(async (values: Record<string, unknown>) => {
    console.log("saving form data", values);
    setIsSaving(true);
    try {
      let transformedValues = values;
      
      // Apply custom transform if provided, otherwise use default
      if (transformBeforeSave) {
        transformedValues = transformBeforeSave(values);
      } else {
        transformedValues = defaultTransformBeforeSave(values);
      }

      const formData = {
        formId,
        data: transformedValues,
        updatedAt: Date.now(),
      };

      // Get existing record for this formId
      const existing = await db.formData.where('formId').equals(formId).first();
      
      if (existing) {
        await db.formData.update(existing.id!, formData);
      } else {
        await db.formData.add(formData);
      }

      setLastSaved(Date.now());
    } catch (error) {
      console.error('Error saving to Dexie:', error);
    } finally {
      setIsSaving(false);
    }
  }, [formId, transformBeforeSave, defaultTransformBeforeSave]);

  // Clear form data from Dexie
  const clearFormData = useCallback(async () => {
    try {
      await db.formData.where('formId').equals(formId).delete();
      setLastSaved(null);
    } catch (error) {
      console.error('Error clearing Dexie data:', error);
    }
  }, [formId]);

  return {
    lastSaved,
    isSaving,
    clearFormData,
    saveFormData,
  };
};
