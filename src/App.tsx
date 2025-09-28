// import { Button } from "antd";
// import AntDForm from "./components/and-form";
// import AntDComponents from "./components/ant-d-com";
// import AntDCom2 from "./components/ant-d-com2";
// import AntDCom2 from "./components/ant-d-com2";
// import AntTable from "./components/table";
// import TimetableScheduler from "./components/table";

// @ts-expect-error - This is a JSX file
// import JSXTable from "./jsxversion/table.jsx";
// import { Watermark } from "antd";
// import TestComponent from "./jsxversion/test-com";
// import AntDTable2 from "./components/table2";
// import AntDTable2 from "./components/table2";
// import AntdCards from "./components/antd-cards";
// import ReactFlowTest from "./components/ReactFlow/react-flow";
// import AutoFlowDemo from "./components/ReactFlow/AutoLayoutDemo";

// import { Button } from "antd";
// import MultiSteps from "./components/muti-steps";
// import LongPress from "./components/long-press";
// import ButtonAnimation from "./components/button-animation";
// import { google} from 'calendar-link'
// import ReactBeautifulDnD from "./components/react-beautiful-dnd";
import Dnd from "./components/dnd/dnd";
// const gmaplink = "https://www.google.com/maps/search/?api=1&query=16.8109542,96.114144";
const App = () => {
//   const lat = 16.8109542;
// const lng = 96.114144;

// const event = {
//   uid: "your-unqiue-id",
//   title: "My birthday party",
//   description: "Be there!",
//   start: "2019-12-29 18:00:00 +0100",
//   duration: [3, "hour"],
// };
// // const googleLink = google(event);
// console.log("navigator.userAgent", navigator.userAgent)
// const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);

// console.log("isIOS", isIOS)
// const gmaplink = isIOS
//   ? `http://maps.apple.com/?q=${lat},${lng}`
//   : `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
  return (
    <div>

       {/* <ReactBeautifulDnD /> */}
      {/* <h1>Hello World</h1>
      <Button type="primary">Click me</Button> */}

      {/* <div className="timetable-container">
        <AntTable />
      </div> */}

      {/* <div className="timetable-container">
        <p>JSX Version</p>
        <JSXTable />
      </div> */}
      {/* <LongPress /> */}
      <Dnd />

{/* <p>hello</p>
<a
  href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=Dinner+with+Friends&dates=20251001T120000Z/20251001T140000Z&details=Catching+up+at+our+favorite+restaurant&location=Yangon"
  target="_blank"
  rel="noopener noreferrer"
>
  Add to Calendar
</a> */}
      {/* <a href={gmaplink} target='_blank' rel='noopener noreferrer'>{"click this link to see in google maps"}</a> */}
      {/* <AntdCards /> */}

      {/* <ReactFlowTest /> */}
      {/* <AutoFlowDemo /> */}

      <div>
        {/* <TestComponent /> */}
      </div>
      {/* <MultiSteps /> */}

      {/* <Button onClick={() => {
        const googleLink = google(event);
        window.open(googleLink, "_blank");
      }}>
          CLICK ME TO ADD TO CALENDAR
      </Button> */}

      {/* <p>
         <a href={google(event)}>Click me to add to calendar</a>
      </p> */}

      {/* <ButtonAnimation /> */}

      {/* <Watermark content={"Ant Design is Great"}>
        <div
          style={{
            paddingInline: "50px",
          }}
        >
          <AntDCom2 />
        </div>
      </Watermark> */}
      {/* <div className="timetable-container">
        <AntDTable2 />
      </div> */}
      {/* 
      <div>
        <AntDComponents />
      </div>

      <div
        style={{
          maxWidth: "500px",
          paddingBottom: "200px",
        }}
      >
        <AntDForm />
      </div> */}
    </div>
  );
};

export default App;
