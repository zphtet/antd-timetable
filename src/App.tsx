// import { Button } from "antd";
// import AntDForm from "./components/and-form";
// import AntDComponents from "./components/ant-d-com";
// import AntDCom2 from "./components/ant-d-com2";
// import AntDCom2 from "./components/ant-d-com2";
// import AntTable from "./components/table";
// import TimetableScheduler from "./components/table";

// @ts-expect-error - This is a JSX file
import JSXTable from "./jsxversion/table.jsx";
// import { Watermark } from "antd";
import TestComponent from "./jsxversion/test-com";
// import AntDTable2 from "./components/table2";
// import AntDTable2 from "./components/table2";
const App = () => {
  return (
    <div>
      {/* <h1>Hello World</h1>
      <Button type="primary">Click me</Button> */}

      {/* <div className="timetable-container">
        <AntTable />
      </div> */}

      <div className="timetable-container">
        <p>JSX Version</p>
        <JSXTable />
      </div>

      <div>
        <TestComponent />
      </div>

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
