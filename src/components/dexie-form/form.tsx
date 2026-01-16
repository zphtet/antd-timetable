import { useState } from 'react';
import {
  Form,
  Input,
  Select,
  DatePicker,
  Checkbox,
  Button,
  Card,
  Space,
  Row,
  Col,
  message,
} from 'antd';
import { useOfflineForm } from './useOfflineForm';

const { Option } = Select;
const { TextArea } = Input;

interface PersonalInfoFormProps {
  formId?: string; // Optional formId - defaults to 'personal-info-form'
}

const PersonalInfoForm = ({ formId = 'personal-info-form' }: PersonalInfoFormProps) => {
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Use the offline form hook
  const { lastSaved, clearFormData, saveFormData } = useOfflineForm({
    formId,
    form,
  });

  // Auto-save to Dexie on form field changes
  const handleValuesChange = async (_changedValues: unknown, allValues: Record<string, unknown>) => {
    console.log('allValues on handleValuesChange', allValues);
    await saveFormData(allValues);
  };

  const handleSubmit = async (values: Record<string, unknown>) => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: 'Form Submission',
          body: JSON.stringify(values),
          userId: 1,
        }),
      });

      if (!response.ok) {
        throw new Error('Network error');
      }

      await response.json();

      // Clear Dexie data after successful submission
      await clearFormData();
      form.resetFields();
      
      message.success('Form submitted successfully! Offline data cleared.');
    } catch (error) {
      // If network error, data is still saved in Dexie
      message.error(
        'Network error. Your data has been saved offline and will be submitted when connection is restored.'
      );
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card
      title="Personal Information Form"
      style={{ maxWidth: 800, margin: '0 auto', padding: '20px' }}
    >
      {lastSaved && (
        <div style={{ marginBottom: 16, color: '#52c41a', fontSize: 12 }}>
          ✓ Data saved offline at {new Date(lastSaved).toLocaleTimeString()}
        </div>
      )}
      
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        onValuesChange={handleValuesChange}
        autoComplete="off"
      >
        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              label="First Name"
              name="firstName"
              rules={[{ required: true, message: 'Please enter your first name' }]}
            >
              <Input placeholder="Enter your first name" />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item
              label="Last Name"
              name="lastName"
              rules={[{ required: true, message: 'Please enter your last name' }]}
            >
              <Input placeholder="Enter your last name" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: 'Please enter your email' },
                { type: 'email', message: 'Please enter a valid email' },
              ]}
            >
              <Input type="email" placeholder="example@email.com" />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item
              label="Phone Number"
              name="phone"
              rules={[{ required: true, message: 'Please enter your phone number' }]}
            >
              <Input placeholder="+1 234 567 8900" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Date of Birth"
              name="dateOfBirth"
              rules={[{ required: true, message: 'Please select your date of birth' }]}
            >
              <DatePicker
                style={{ width: '100%' }}
                placeholder="Select date of birth"
                format="YYYY-MM-DD"
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item
              label="Gender"
              name="gender"
              rules={[{ required: true, message: 'Please select your gender' }]}
            >
              <Select placeholder="Select gender">
                <Option value="male">Male</Option>
                <Option value="female">Female</Option>
                <Option value="other">Other</Option>
                <Option value="prefer-not-to-say">Prefer not to say</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Country"
              name="country"
              rules={[{ required: true, message: 'Please select your country' }]}
            >
              <Select placeholder="Select country" showSearch>
                <Option value="usa">United States</Option>
                <Option value="uk">United Kingdom</Option>
                <Option value="canada">Canada</Option>
                <Option value="australia">Australia</Option>
                <Option value="singapore">Singapore</Option>
                <Option value="malaysia">Malaysia</Option>
                <Option value="myanmar">Myanmar</Option>
                <Option value="other">Other</Option>
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item
              label="City"
              name="city"
              rules={[{ required: true, message: 'Please enter your city' }]}
            >
              <Input placeholder="Enter your city" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label="Address"
          name="address"
          rules={[{ required: true, message: 'Please enter your address' }]}
        >
          <TextArea rows={3} placeholder="Enter your full address" />
        </Form.Item>

        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Postal Code"
              name="postalCode"
              rules={[{ required: true, message: 'Please enter your postal code' }]}
            >
              <Input placeholder="12345" />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item
              label="OTP Code"
              name="otp"
              rules={[
                { required: true, message: 'Please enter OTP code' },
                { len: 6, message: 'OTP must be 6 digits' },
                { pattern: /^\d+$/, message: 'OTP must contain only numbers' },
              ]}
            >
              <Input
                placeholder="000000"
                maxLength={6}
                style={{ letterSpacing: '8px', textAlign: 'center', fontSize: '18px' }}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Occupation"
              name="occupation"
              rules={[{ required: true, message: 'Please select your occupation' }]}
            >
              <Select placeholder="Select occupation">
                <Option value="student">Student</Option>
                <Option value="engineer">Engineer</Option>
                <Option value="doctor">Doctor</Option>
                <Option value="teacher">Teacher</Option>
                <Option value="business">Business</Option>
                <Option value="designer">Designer</Option>
                <Option value="developer">Developer</Option>
                <Option value="other">Other</Option>
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item
              label="Education Level"
              name="education"
              rules={[{ required: true, message: 'Please select your education level' }]}
            >
              <Select placeholder="Select education level">
                <Option value="high-school">High School</Option>
                <Option value="bachelor">Bachelor's Degree</Option>
                <Option value="master">Master's Degree</Option>
                <Option value="phd">PhD</Option>
                <Option value="other">Other</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="agreeToTerms"
          valuePropName="checked"
          rules={[
            {
              validator: (_, value) =>
                value
                  ? Promise.resolve()
                  : Promise.reject(new Error('You must agree to the terms and conditions')),
            },
          ]}
        >
          <Checkbox>I agree to the terms and conditions</Checkbox>
        </Form.Item>

        <Form.Item name="newsletter" valuePropName="checked">
          <Checkbox>Subscribe to newsletter</Checkbox>
        </Form.Item>

        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit" loading={isSubmitting} size="large">
              Submit Form
            </Button>
            <Button
              onClick={async () => {
                await clearFormData();
                form.resetFields();
                message.success('Form cleared and offline data removed');
              }}
            >
              Clear Form
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default PersonalInfoForm;
