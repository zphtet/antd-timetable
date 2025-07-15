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
  Carousel,
  Collapse,
  type CollapseProps,
  QRCode,
  Segmented,
  Statistic,
  Timeline,
} from "antd";
import { useState } from "react";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
const AntDCom2 = () => {
  const [radioValue, setRadioValue] = useState<number>(1);
  const [count, setCount] = useState<number>(20);
  const [treeValue, setTreeValue] = useState<string>();

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
  return (
    <div>
      <Space direction="vertical">
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
