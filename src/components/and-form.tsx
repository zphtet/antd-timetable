import { Form, Input, Button } from "antd";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

type FormValues = z.infer<typeof schema>;

const AntDForm = () => {
  const { control, handleSubmit } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });
  const onFinish = (values: any) => {
    console.log("values", values);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("errorInfo", errorInfo);
  };

  const onSubmit = (values: FormValues) => {
    console.log("values", values);
  };

  return (
    <div>
      AntDForm
      <Form onFinish={handleSubmit(onSubmit)}>
        <Form.Item label="Name" required={true}>
          <Controller
            control={control}
            name="name"
            render={({ field, fieldState }) => (
              <>
                <Input {...field} placeholder="Enter your name" />
                {fieldState.error && (
                  <div style={{ color: "red" }}>{fieldState.error.message}</div>
                )}
              </>
            )}
          />
          {/* <Input /> */}
        </Form.Item>
        <Form.Item label="Email" required={true} validateStatus="error">
          <Controller
            control={control}
            name="email"
            render={({ field, fieldState }) => (
              <>
                <Input {...field} placeholder="Enter your email" />
                {fieldState.error && (
                  <div style={{ color: "red" }}>{fieldState.error.message}</div>
                )}
              </>
            )}
          />
        </Form.Item>
        <Form.Item label="Password" required={true}>
          <Controller
            control={control}
            name="password"
            render={({ field, fieldState }) => (
              <>
                <Input.Password {...field} placeholder="Enter your password" />
                {fieldState.error && (
                  <div style={{ color: "red" }}>{fieldState.error.message}</div>
                )}
              </>
            )}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AntDForm;
