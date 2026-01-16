import { useState } from 'react';
import { Form, Input, Button, Card, Space, message } from 'antd';
import { useOfflineForm } from './useOfflineForm';

/**
 * Example: How to use useOfflineForm with multiple dynamic forms
 * 
 * This example shows:
 * 1. Multiple forms with different formIds
 * 2. Dynamic form creation
 * 3. Each form maintains its own offline data independently
 */

// Example 1: Simple Contact Form
const ContactForm = ({ formId }: { formId: string }) => {
  const [form] = Form.useForm();
  const { lastSaved, clearFormData, saveFormData } = useOfflineForm({
    formId,
    form,
  });

  const handleSubmit = async (values: Record<string, unknown>) => {
    try {
      // Your API call here
      console.log('Submitting contact form:', values);
      await clearFormData();
      form.resetFields();
      message.success('Contact form submitted!');
    } catch (error) {
      message.error('Submission failed. Data saved offline.');
    }
  };

  return (
    <Card title={`Contact Form (ID: ${formId})`} style={{ marginBottom: 16 }}>
      {lastSaved && (
        <div style={{ marginBottom: 8, color: '#52c41a', fontSize: 12 }}>
          ✓ Saved at {new Date(lastSaved).toLocaleTimeString()}
        </div>
      )}
      <Form
        form={form}
        onFinish={handleSubmit}
        onValuesChange={(_changed, allValues) => saveFormData(allValues)}
        layout="vertical"
      >
        <Form.Item name="name" label="Name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
          <Input />
        </Form.Item>
        <Form.Item name="message" label="Message" rules={[{ required: true }]}>
          <Input.TextArea rows={4} />
        </Form.Item>
        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
            <Button onClick={() => { clearFormData(); form.resetFields(); }}>
              Clear
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  );
};

// Example 2: Dynamic Forms Manager
const DynamicFormsExample = () => {
  const [formIds, setFormIds] = useState<string[]>(['form-1', 'form-2']);
  const [nextId, setNextId] = useState(3);

  const addForm = () => {
    const newId = `form-${nextId}`;
    setFormIds([...formIds, newId]);
    setNextId(nextId + 1);
  };

  const removeForm = (idToRemove: string) => {
    setFormIds(formIds.filter(id => id !== idToRemove));
  };

  return (
    <div style={{ padding: 20 }}>
      <Card>
        <Space style={{ marginBottom: 16 }}>
          <Button type="primary" onClick={addForm}>
            Add New Form
          </Button>
          <span>Total Forms: {formIds.length}</span>
        </Space>

        {formIds.map(formId => (
          <div key={formId} style={{ marginBottom: 16 }}>
            <ContactForm formId={formId} />
            <Button
              danger
              size="small"
              onClick={() => removeForm(formId)}
              style={{ marginTop: 8 }}
            >
              Remove Form
            </Button>
          </div>
        ))}
      </Card>
    </div>
  );
};

// Example 3: Form with Custom Transformations
const CustomTransformForm = () => {
  const [form] = Form.useForm();
  
  const { lastSaved, clearFormData, saveFormData } = useOfflineForm({
    formId: 'custom-transform-form',
    form,
    // Custom transform before saving - e.g., encrypt sensitive data
    transformBeforeSave: (values) => {
      return {
        ...values,
        // Add any transformations here
        processedAt: new Date().toISOString(),
      };
    },
    // Custom transform after loading - e.g., decrypt or format data
    transformAfterLoad: (data) => {
      return {
        ...data,
        // Add any transformations here
      };
    },
    // Callback when data is loaded
    onLoad: (data) => {
      console.log('Form data loaded:', data);
    },
  });

  return (
    <Card title="Custom Transform Form">
      <Form
        form={form}
        onValuesChange={(_changed, allValues) => saveFormData(allValues)}
        layout="vertical"
      >
        <Form.Item name="field1" label="Field 1">
          <Input />
        </Form.Item>
        <Form.Item>
          <Button onClick={() => { clearFormData(); form.resetFields(); }}>
            Clear
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export { ContactForm, DynamicFormsExample, CustomTransformForm };
