import {
  FloatButton,
  Space,
  Divider,
  Splitter,
  Typography,
  Breadcrumb,
  Dropdown,
  type MenuProps,
  Steps,
  Tabs,
  Cascader,
  Checkbox,
  Col,
  Row,
  ColorPicker,
  DatePicker,
  type DatePickerProps,
} from "antd";
import {
  CiCircleFilled,
  DownOutlined,
  MinusOutlined,
  PlusOutlined,
  LoadingOutlined,
} from "@ant-design/icons";

interface Option {
  label: string;
  value: string;
  children?: Option[];
}

const AntDComponents = () => {
  const dropdownItems: MenuProps["items"] = [
    {
      key: "item 1",
      label: "Item 1",
      icon: <CiCircleFilled />,
    },
    {
      key: "item 2",
      label: "Item 2",
      icon: <CiCircleFilled />,
      disabled: true,
    },
    {
      key: "item 3",
      label: "Item 3",
      icon: <CiCircleFilled />,
      danger: true,
    },
    {
      key: "item 4",
      label: "Item 4",
      icon: <CiCircleFilled />,
    },
  ];

  const options: Option[] = [
    {
      value: "zhejiang",
      label: "Zhejiang",
      children: [
        {
          value: "hangzhou",
          label: "Hangzhou",
        },
        {
          value: "ningbo",
          label: "Ningbo",
        },
      ],
    },
    {
      value: "jiangsu",
      label: "Jiangsu",
      children: [
        {
          value: "nanjing",
          label: "Nanjing",
        },
      ],
    },
  ];

  const options2: Option[] = [
    {
      value: "light",
      label: "Light",
      children: Array.from({ length: 10 }, (_, index) => ({
        value: `light-${index}`,
        label: `Light-${index}`,
      })),
    },
    {
      value: "Bambino",
      label: "Bambino",
      children: [
        {
          value: "Bambino-1",
          label: "Bambino-1",
        },
        {
          value: "Bambino-2",
          label: "Bambino-2",
        },
      ],
    },
  ];
  const { SHOW_CHILD } = Cascader;

  const onChnageCheckedBox = (checkedValue: string[]) => {
    console.log("On Change Checked Box", checkedValue);
  };
  const onChangeDatePicker: DatePickerProps["onChange"] = (
    date,
    dateString
  ) => {
    console.log("date", date, new Date(date.toString()));
    console.log("dateString", dateString);
  };

  return (
    <div
      className="relative"
      style={{
        padding: "50px",
      }}
    >
      <div>
        <FloatButton.Group
          shape="square"
          style={{
            insetInlineEnd: 10,
            insetBlockEnd: 10,
          }}
        >
          <FloatButton icon={<PlusOutlined />} type="primary" />
          <FloatButton icon={<MinusOutlined />} />
          <FloatButton />
          {/* <FloatButton icon={<MinusOutlined />} shape="square" type="primary" />
          <FloatButton icon={<PlusOutlined />} shape="square" type="primary" /> */}
        </FloatButton.Group>

        <Divider plain orientation="left" orientationMargin={10}>
          This is divider
        </Divider>

        <Splitter
          style={{
            width: "100%",
            height: "300px",
          }}
          //   layout="vertical"
        >
          <Splitter.Panel
            style={{
              background: "blue",
            }}
            min={"20%"}
            collapsible
          >
            <Typography.Text>First Section</Typography.Text>
          </Splitter.Panel>
          <Splitter.Panel
            style={{
              background: "red",
            }}
            min={"20%"}
            collapsible
          >
            <Typography.Text>Second Section</Typography.Text>
          </Splitter.Panel>
        </Splitter>

        {/* <Row>
          <Col span={20}>
            <div
              id="part-1"
              style={{ height: "100vh", background: "rgba(255,0,0,0.02)" }}
            />
            <div
              id="part-2"
              style={{ height: "100vh", background: "rgba(0,255,0,0.02)" }}
            />
            <div
              id="part-3"
              style={{ height: "100vh", background: "rgba(0,0,255,0.02)" }}
            />
          </Col>
          <Col span={4}>
            {(() => {
              const [collapsed, setCollapsed] = useState(true);

              const handleToggle = () => setCollapsed((prev) => !prev);

              return (
                <div>
                  <Anchor
                    items={[
                      {
                        key: "part-1",
                        href: "#part-1",
                        title: "Part 1",
                      },
                      {
                        key: "part-2",
                        href: "#part-2",
                        title: (
                          <span
                            style={{ cursor: "pointer" }}
                            onClick={handleToggle}
                          >
                            Part 2 {collapsed ? "(expand)" : "(collapse)"}
                          </span>
                        ),
                        children: collapsed
                          ? []
                          : [
                              {
                                key: "part-2-1",
                                href: "#part-2-1",
                                title: "Part 2-1",
                              },
                              {
                                key: "part-2-2",
                                href: "#part-2-2",
                                title: "Part 2-2",
                              },
                              {
                                key: "part-2-3",
                                href: "#part-2-3",
                                title: "Part 2-3",
                              },
                            ],
                      },
                      {
                        key: "part-3",
                        href: "#part-3",
                        title: "Part 3",
                      },
                    ]}
                  />
                  <div style={{ fontSize: 12, marginTop: 8, color: "#888" }}>
                    Have a nice day
                  </div>
                </div>
              );
            })()}
          </Col>
        </Row> */}

        <Breadcrumb
          items={[
            {
              title: "Home",
            },
            {
              title: <CiCircleFilled />,
            },
            {
              title: <a href="#">Dashboard</a>,
            },
          ]}
        />

        <Dropdown menu={{ items: dropdownItems }}>
          <a onClick={(e) => e.preventDefault()}>
            <Space>
              Hover me
              <DownOutlined />
            </Space>
          </a>
        </Dropdown>
        <Steps
          current={2}
          items={[
            {
              title: "Step 1",
              description: "This is a description",
            },
            {
              title: "Step 2",
              description: "This is a description",
              status: "error",
            },
            {
              title: "Step 3",
              description: "This is a description",
              icon: <LoadingOutlined />,
              status: "process",
            },
          ]}
        />

        <Tabs
          tabPosition="bottom"
          items={[
            {
              key: "1",
              label: "Tab 1",
              children: <p>Content of Tab Pane 1</p>,
            },
            {
              key: "2",
              label: "Tab 2",
              children: <p>Content of Tab Pane 2</p>,
              disabled: true,
            },
            {
              key: "3",
              label: "Tab 3",
              children: <p>Content of Tab Pane 3</p>,
            },
          ]}
        />

        <Cascader
          options={options}
          onChange={(d) => {
            console.log("On Change data", d);
          }}
          placeholder="Please select"
        />
        <Cascader
          options={options2}
          style={{
            width: "100%",
          }}
          multiple
          maxTagCount={"responsive"}
          onChange={(d) => {
            console.log("On Change data", d);
          }}
          showCheckedStrategy={SHOW_CHILD}
          placeholder="Please select"
          allowClear={false}
        />
      </div>
      <Checkbox.Group style={{ width: "100%" }} onChange={onChnageCheckedBox}>
        <Row>
          <Col span={12}>
            <Checkbox value="A">A</Checkbox>
          </Col>
          <Col span={12}>
            <Checkbox value="B">B</Checkbox>
          </Col>
          <Col span={12}>
            <Checkbox value="C">C</Checkbox>
          </Col>
          <Col span={12}>
            <Checkbox value="D">D</Checkbox>
          </Col>
        </Row>
      </Checkbox.Group>

      <div style={{ width: "100%", height: "100px" }}>
        <ColorPicker
          onChange={(color) => {
            console.log("On Change Color", color);
          }}
        />
      </div>

      <Space direction="vertical" style={{ width: "100%" }}>
        <DatePicker onChange={onChangeDatePicker} variant="underlined" />
        <DatePicker onChange={onChangeDatePicker} picker="week" />
        <DatePicker onChange={onChangeDatePicker} picker="month" />
        <DatePicker onChange={onChangeDatePicker} picker="quarter" />
        <DatePicker onChange={onChangeDatePicker} picker="year" />
      </Space>

      <Space direction="vertical" style={{ width: "100%" }}>
        <DatePicker.RangePicker
          onChange={(d) => {
            console.log("On Change Date Range", d);

            if (d) {
              console.log(
                "On Change Date Range",
                d[0],
                new Date(d[0]?.toString()),
                d[1],
                new Date(d[1]?.toString())
              );
            }
          }}
        />
      </Space>
    </div>
  );
};

export default AntDComponents;
