import { useEffect, useState, useCallback } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../db';
import dayjs from 'dayjs';

/**
 * Custom hook for offline-first form management with Dexie
 * 
 * @param {Object} options - Configuration options
 * @param {string} options.formId - Unique identifier for this form (e.g., 'user-registration', 'contact-form-123')
 * @param {Object} options.form - Ant Design Form instance
 * @param {Function} [options.onLoad] - Optional callback when saved data is loaded
 * @param {Function} [options.transformBeforeSave] - Optional function to transform data before saving to Dexie
 * @param {Function} [options.transformAfterLoad] - Optional function to transform data after loading from Dexie
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
}) => {
  const [lastSaved, setLastSaved] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Load saved form data from Dexie for this specific formId
  const savedData = useLiveQuery(async () => {
    const data = await db.formData.where('formId').equals(formId).first();
    return data;
  });

  // Default transform: convert dayjs objects to strings
  const defaultTransformBeforeSave = useCallback((values) => {
    const transformed = {};
    
    for (const [key, value] of Object.entries(values)) {
      if (value && typeof value === 'object' && 'format' in value) {
        // Check if it's a dayjs object
        try {
          transformed[key] = value.format('YYYY-MM-DD');
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
  const defaultTransformAfterLoad = useCallback((data) => {
    const transformed = {};
    
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
      let transformedData = savedData.data;
      
      // Apply custom transform if provided, otherwise use default
      if (transformAfterLoad) {
        transformedData = transformAfterLoad(savedData.data);
      } else {
        transformedData = defaultTransformAfterLoad(savedData.data);
      }
      
      form.setFieldsValue(transformedData);
      setLastSaved(savedData.updatedAt);
      
      if (onLoad) {
        onLoad(transformedData);
      }
    }
  }, [savedData, form, onLoad, transformAfterLoad, defaultTransformAfterLoad]);

  // Save form data to Dexie
  const saveFormData = useCallback(async (values) => {
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
        await db.formData.update(existing.id, formData);
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
