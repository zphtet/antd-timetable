// import { Button } from "antd";
import AntTable from "./components/table";
import AntDTable2 from "./components/table2";
const App = () => {
  return (
    <div>
      {/* <h1>Hello World</h1>
      <Button type="primary">Click me</Button> */}

      <div className="timetable-container">
        <AntTable />
      </div>
      <div className="timetable-container">
        <AntDTable2 />
      </div>
    </div>
  );
};

export default App;
