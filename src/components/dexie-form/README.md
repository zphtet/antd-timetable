# Offline-First Forms with Dexie

This solution provides a reusable hook for managing multiple dynamic forms with offline support using Dexie.

## Features

- ✅ **Multiple Forms Support**: Each form can have its own unique `formId`
- ✅ **Auto-save**: Form data is automatically saved to IndexedDB on every change
- ✅ **Auto-load**: Saved data is automatically loaded when the form component mounts
- ✅ **Dynamic Forms**: Create forms dynamically without knowing their structure ahead of time
- ✅ **Custom Transformations**: Transform data before saving or after loading
- ✅ **Isolated Storage**: Each form's data is stored separately and independently

## Basic Usage

```tsx
import { Form } from 'antd';
import { useOfflineForm } from './useOfflineForm';

const MyForm = ({ formId }: { formId: string }) => {
  const [form] = Form.useForm();
  
  const { lastSaved, clearFormData, saveFormData } = useOfflineForm({
    formId, // Unique identifier for this form
    form,
  });

  const handleSubmit = async (values: Record<string, unknown>) => {
    try {
      // Your API call
      await fetch('/api/submit', { method: 'POST', body: JSON.stringify(values) });
      
      // Clear offline data after successful submission
      await clearFormData();
      form.resetFields();
    } catch (error) {
      // Data remains in Dexie if submission fails
      console.error('Submission failed');
    }
  };

  return (
    <Form
      form={form}
      onFinish={handleSubmit}
      onValuesChange={(_changed, allValues) => saveFormData(allValues)}
    >
      {/* Your form fields */}
    </Form>
  );
};
```

## Dynamic Forms Example

```tsx
const DynamicForms = () => {
  const [formIds, setFormIds] = useState<string[]>([]);

  const addForm = () => {
    const newId = `form-${Date.now()}`;
    setFormIds([...formIds, newId]);
  };

  return (
    <div>
      <Button onClick={addForm}>Add Form</Button>
      {formIds.map(formId => (
        <MyForm key={formId} formId={formId} />
      ))}
    </div>
  );
};
```

## Advanced Usage

### Custom Transformations

```tsx
const { saveFormData } = useOfflineForm({
  formId: 'my-form',
  form,
  // Transform data before saving
  transformBeforeSave: (values) => {
    return {
      ...values,
      processedAt: new Date().toISOString(),
    };
  },
  // Transform data after loading
  transformAfterLoad: (data) => {
    return {
      ...data,
      // Your transformations
    };
  },
  // Callback when data is loaded
  onLoad: (data) => {
    console.log('Data loaded:', data);
  },
});
```

### Form ID Strategies

1. **Static IDs**: `formId="user-registration"`
2. **Dynamic IDs**: `formId={`user-${userId}`}`
3. **UUIDs**: `formId={uuidv4()}`
4. **Route-based**: `formId={location.pathname}`

## API Reference

### `useOfflineForm(options)`

#### Options

- `formId` (string, required): Unique identifier for this form
- `form` (FormInstance, required): Ant Design Form instance
- `onLoad?` (function): Callback when saved data is loaded
- `transformBeforeSave?` (function): Transform data before saving
- `transformAfterLoad?` (function): Transform data after loading

#### Returns

- `lastSaved` (number | null): Timestamp of last save
- `isSaving` (boolean): Whether data is currently being saved
- `clearFormData` (function): Clear form data from Dexie
- `saveFormData` (function): Manually save form data

## Database Schema

The database stores form data with the following structure:

```typescript
interface FormData {
  id?: number;
  formId: string;        // Unique form identifier
  data: Record<string, unknown>; // Generic form data
  updatedAt: number;     // Timestamp
}
```

Each form's data is stored separately based on `formId`, allowing multiple forms to coexist without conflicts.
