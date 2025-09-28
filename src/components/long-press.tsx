import { useLongPress } from "@uidotdev/usehooks";
import { Button , Form } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { useState } from "react";
const LongPress = () => {
    const [isPrev , setIsPrev] = useState(false);
    const [isNext , setIsNext] = useState(false);

    const prevAttr = useLongPress(() => {
        setIsPrev(true);
    }, {
        onStart: () => { setIsPrev(true); },
        onFinish: () => { setIsPrev(false); },
        onCancel: () => { setIsPrev(false); },
        threshold: 600,
    });

    const nextAttr = useLongPress(() => {
        setIsNext(true);
    }, {
        onStart: () => { setIsNext(true); },
        onFinish: () => { setIsNext(false); },
        onCancel: () => { setIsNext(false); },
        threshold: 600,
    });

  return <div style={{
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: "1rem",
    marginTop: "3rem",
    height: 100,
  }}>
    <Form.Item style={{
      flex: isPrev ? 2 : 1,
      marginBottom: 10,
      transition: "flex 300ms ease, margin-bottom 300ms ease, transform 300ms ease",
    }}>
      <Button
        {...prevAttr}
        style={{
          width: "100%",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "flex-start",
          gap: 8,
          overflow: "hidden",
          transition: "background 200ms ease, color 200ms ease",
        }}
        icon={<LeftOutlined />}
      >
        <span style={{ whiteSpace: "nowrap" }}>Previous</span>
        <span
          style={{
            maxWidth: isPrev ? 360 : 0,
            opacity: isPrev ? 1 : 0,
            marginLeft: isPrev ? 8 : 0,
            whiteSpace: "nowrap",
            overflow: "hidden",
            transition: "max-width 400ms ease, opacity 250ms ease, margin-left 250ms ease",
          }}
        >
          Previous details go here
        </span>
      </Button>
    </Form.Item>

    <Form.Item style={{
      flex: isNext ? 2 : 1,
      marginBottom: 10,
      transition: "flex 300ms ease, margin-bottom 300ms ease, transform 300ms ease",
    }}>
      <Button
        {...nextAttr}
        style={{
          width: "100%",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "flex-start",
          gap: 8,
          overflow: "hidden",
          transition: "background 200ms ease, color 200ms ease",
        }}
        icon={<RightOutlined />}
      >
        <span style={{ whiteSpace: "nowrap" }}>Next</span>
        <span
          style={{
            maxWidth: isNext ? 360 : 0,
            opacity: isNext ? 1 : 0,
            marginLeft: isNext ? 8 : 0,
            whiteSpace: "nowrap",
            overflow: "hidden",
            transition: "max-width 400ms ease, opacity 250ms ease, margin-left 250ms ease",
          }}
        >
          Next details go here
        </span>
      </Button>
    </Form.Item>
  </div>;
};

export default LongPress;