import {
  Input,
  InputNumber,
  Select,
  Space,
  Mentions,
  Radio,
  Rate,
  Slider,
  TreeSelect,
  //   UploadFile,
  Badge,
  message,
  Button,
  Upload,
  Avatar,
  Alert,
  Calendar,
  // Carousel,
  Collapse,
  type CollapseProps,
  Tour,
  QRCode,
  Segmented,
  Statistic,
  Timeline,
  Tree,
  type TourProps,
  type TreeDataNode,
  Drawer,
  Progress,
  type ProgressProps,
  Result,
  Skeleton,
  Spin,
} from "antd";
import { useRef, useState } from "react";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";

import {
  CheckCircleFilled,
  LoadingOutlined,
  SmileFilled,
  StepForwardOutlined,
} from "@ant-design/icons";
const AntDCom2 = () => {
  const [radioValue, setRadioValue] = useState<number>(1);
  const [count, setCount] = useState<number>(20);
  const [treeValue, setTreeValue] = useState<string>();

  const [messageApi, contextHolder] = message.useMessage();

  const [value, setValue] = useState(() => dayjs("2017-01-25"));
  const [selectedValue, setSelectedValue] = useState(() => dayjs("2017-01-25"));

  const onTreeChange = (value: string) => {
    setTreeValue(value);
  };

  const onSelect = (newValue: Dayjs) => {
    setValue(newValue);
    setSelectedValue(newValue);
  };

  const onPanelChange = (newValue: Dayjs) => {
    setValue(newValue);
  };

  const panelStyle: React.CSSProperties = {
    marginBottom: 24,
    background: "#3bc73b212",
    borderRadius: "10px",
    border: "none",
  };

  const items: CollapseProps["items"] = [
    {
      key: "1",
      label: "This is panel header 1",
      children: (
        <p
          style={{
            color: "red",
          }}
        >
          Some contents...
        </p>
      ),
      showArrow: true,
      style: panelStyle,
    },
    {
      key: "2",
      label: "This is panel header 2",
      children: <p>Some contents...</p>,
      showArrow: true,
      style: panelStyle,
    },
  ];

  const SelectBefore = () => {
    return (
      <Select defaultValue={"http://"}>
        <Select.Option value="https://">https://</Select.Option>
        <Select.Option value="http://">http://</Select.Option>
      </Select>
    );
  };

  const SelectAfter = () => {
    return (
      <Select defaultValue={".com"}>
        <Select.Option value="com">.com</Select.Option>
        <Select.Option value="net">.net</Select.Option>
        <Select.Option value="org">.org</Select.Option>
        <Select.Option value="edu">.edu</Select.Option>
        <Select.Option value="gov">.gov</Select.Option>
        <Select.Option value="mil">.mil</Select.Option>
        <Select.Option value="int">.int</Select.Option>
      </Select>
    );
  };

  const contentStyle: React.CSSProperties = {
    height: "160px",
    color: "#fff",
    lineHeight: "160px",
    textAlign: "center",
    background: "#364d79",
  };

  const ref1 = useRef<HTMLDivElement>(null);
  const ref2 = useRef<HTMLDivElement>(null);
  const ref3 = useRef<HTMLDivElement>(null);
  // const ref4 = useRef<HTMLDivElement>(null);
  // const ref5 = useRef<HTMLDivElement>(null);
  // const ref6 = useRef<HTMLDivElement>(null);

  const steps: TourProps["steps"] = [
    {
      title: "Upload Your Image",
      description: "Upload your image to the system",
      target: () => ref1.current!,
    },
    {
      title: "Save Your Image",
      description: "Save your image to the system",
      target: () => ref2.current!,
    },
    {
      title: "View Your Image",
      description: "View your image in the system",
      target: () => ref3.current!,
    },
  ];
  const [isTourOpen, setIsTourOpen] = useState(false);

  const treeData: TreeDataNode[] = [
    {
      title: "Node-1",
      key: "Node-1",
      children: [
        {
          title: "Node-1-1",
          key: "Node-1-1",
          children: [
            {
              title: "Node-1-1-1",
              key: "Node-1-1-1",
            },
            {
              title: "Node-1-1-2",
              key: "Node-1-1-2",
              children: [
                {
                  title: "Node-1-1-2-1",
                  key: "Node-1-1-2-1",
                },
              ],
            },
          ],
        },
        {
          title: "Node-1-2",
          key: "Node-1-2",
        },
      ],
    },
    {
      title: "Node-2",
      key: "Node-2",
      children: [
        {
          title: "Node-2-1",
          key: "Node-2-1",
        },
        {
          title: "Node-2-2",
          key: "Node-2-2",
          children: [
            {
              title: "Node-2-2-1",
              key: "Node-2-2-1",
            },
            {
              title: "Node-2-2-2",
              key: "Node-2-2-2",
            },
          ],
        },
      ],
    },
    {
      title: "Node-3",
      key: "Node-3",
      children: [
        {
          title: "Node-3-1",
          key: "Node-3-1",
        },
      ],
    },
  ];
  const [open, setOpen] = useState(false);

  const info = () => {
    messageApi
      .open({
        key: "hello",
        type: "loading",
        content: "Hello World",
        duration: 2.5,
        icon: <LoadingOutlined />,
      })
      .then(() => message.success("Loading succeed"));
  };

  const mutationMessage = () => {
    messageApi.open({
      key: "mutation",
      type: "loading",
      content: "Loading...",
      // duration: 2.5,
      // icon: <LoadingOutlined />,
    });
    setTimeout(() => {
      messageApi.open({
        key: "mutation",
        type: "success",
        content: "Loading succeed",
        icon: (
          <CheckCircleFilled
            style={{
              color: "green",
            }}
          />
        ),
      });
    }, 2000);
  };

  const conicColors: ProgressProps["strokeColor"] = {
    "0%": "#87d068",
    "50%": "#ffe58f",
    "100%": "#ffccc7",
  };

  const [percentage, setPercentage] = useState(30);
  return (
    <div>
      {contextHolder}
      <Space direction="vertical">
        <Spin tip="Loading" />
        <Skeleton.Button />
        <Skeleton.Avatar active />
        <Skeleton.Input active />
        <Progress
          percent={percentage}
          type="circle"
          // strokeColor={conicColors}
          // status="normal"
        />
        <Button onClick={() => setPercentage(percentage + 10)}>
          Increment
        </Button>
        <Button onClick={() => setPercentage(percentage - 10)}>Decrease</Button>

        <Progress percent={30} type="line" />
        <Result
          status="info"
          icon={<SmileFilled style={{ color: "blue" }} />}
          title="Successfully"
          subTitle="You can now use your account"
          extra={<Button type="primary">Back Home</Button>}
        />
        <Button onClick={info}>Info Message</Button>
        <Button onClick={mutationMessage}>Mutation Message</Button>
        <Button type="primary" onClick={() => setOpen(true)}>
          Open Drawer
        </Button>
        <Drawer
          title={"Basic Drawer"}
          open={open}
          onClose={() => setOpen(false)}
          placement="right"
          footer={
            <div>
              <p>this is footer</p>
            </div>
          }
          children={
            <div>
              <p>
                Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                Ratione necessitatibus incidunt omnis magnam voluptatem
                temporibus unde illo architecto impedit ipsam.
              </p>
            </div>
          }
        />
        <Tree.DirectoryTree
          checkable
          treeData={treeData}
          onCheck={(checkedKeys, info) => {
            console.log("Checked Keys", checkedKeys, info);
          }}
          onSelect={(selectedKeys, info) => {
            console.log("Selected Keys", selectedKeys, info);
          }}
        />
        <Button type="primary" onClick={() => setIsTourOpen(true)}>
          Begin Tour
        </Button>
        <Space>
          <Button ref={ref1}>Upload</Button>
          <Button ref={ref2}>Save</Button>
          <Button ref={ref3}>View</Button>
        </Space>
        <Tour
          open={isTourOpen}
          onClose={() => {
            setIsTourOpen(false);
          }}
          steps={steps}
        />
        <Timeline
          items={[
            {
              children: "created on yesterday",
            },
            {
              children: "created on yesterday",
            },
            {
              children: "created on yesterday",
            },
          ]}
        />
        <Statistic.Timer
          type="countdown"
          value={dayjs("2025-07-15 18:00:00").valueOf()}
          format="HH:mm:ss"
        />
        <Segmented options={["Daily", "Weekly", "Monthly", "Yearly"]} />
        <QRCode value="https://zinpainghtetdev.vercel.app/" />
        <Collapse
          items={items}
          defaultActiveKey={"1"}
          bordered={false}
          onChange={(data) => {
            console.log("onChangeData", data);
          }}
        />
        {/* <Carousel autoplay>
          <div style={contentStyle}>
            <h3>1</h3>
          </div>
          <div style={contentStyle}>
            <h3>2</h3>
          </div>
          <div style={contentStyle}>
            <h3>3</h3>
          </div>
          <div style={contentStyle}>
            <h3>4</h3>
          </div>
        </Carousel> */}
        <>
          <Alert
            message={`You selected date: ${selectedValue?.format(
              "YYYY-MM-DD"
            )}`}
          />
          <Calendar
            value={value}
            onSelect={onSelect}
            onPanelChange={onPanelChange}
          />
        </>
        <Button
          onClick={() => {
            setCount(count + 1);
          }}
        >
          + increment
        </Button>
        <Badge count={count}>
          <Avatar shape="square"></Avatar>
        </Badge>
        <Button
          onClick={() => {
            message.error("Error message");
          }}
        >
          Click me to show message
        </Button>
        <Upload
          action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
          listType="picture"
          maxCount={1}
          multiple={true}
          onRemove={() => {}}
        >
          <Button>Upload Yours</Button>
        </Upload>
        <TreeSelect
          //   treeDefaultExpandAll={true}
          onChange={onTreeChange}
          value={treeValue}
          style={{
            width: "100%",
          }}
          treeData={[
            {
              title: "Node-1",
              value: "Node-1",
              children: [
                {
                  title: "Node-1-1",
                  value: "Node-1-1",
                  children: [
                    {
                      title: "Node-1-1-1",
                      value: "Node-1-1-1",
                      children: [
                        {
                          title: "Node-1-1-1-1",
                          value: "Node-1-1-1-1",
                        },
                        {
                          title: "Node-1-1-1-2",
                          value: "Node-1-1-1-2",
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              title: "Node-2",
              value: "Node-2",
            },
          ]}
        />
        <Slider range max={20} min={0} marks={{ 0: "A", 10: "M", 20: "Z" }} />
        <Rate allowClear={true} allowHalf={true} count={10} />
        <Radio.Group
          value={radioValue}
          onChange={(e) => {
            setRadioValue(e.target.value);
          }}
          optionType="button"
          options={[
            {
              label: "Bar Chart",
              value: 1,
              disabled: true,
            },
            {
              label: "Pie Chart",
              value: 2,
            },
            {
              label: "Line Chart",
              value: 3,
            },
            {
              label: "Scatter Chart",
              value: 4,
            },
          ]}
        ></Radio.Group>
        <Mentions
          placeholder="Enter @ to mention people, you can enter 2-30 words"
          style={{ width: "100%" }}
          options={[
            {
              value: "zph",
              label: "zph",
            },
            {
              value: "zph2",
              label: "zph2",
            },
            {
              value: "zph3",
              label: "zph3",
            },
          ]}
        />
        <InputNumber defaultValue={2} status="warning" min={1} max={10} />
        <Space.Compact>
          <Input style={{ width: "20%" }} placeholder="https://" />
          <Input style={{ width: "60%" }} placeholder="zph" />
          <Input style={{ width: "20%" }} placeholder=".com" />
        </Space.Compact>
        <Input
          style={{
            width: "100%",
          }}
          addonBefore={<SelectBefore />}
          addonAfter={<SelectAfter />}
          defaultValue={"zph"}
        />
      </Space>
    </div>
  );
};

export default AntDCom2;
