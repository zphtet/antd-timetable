import { Button } from "antd";
import AntTable from "./components/table";
const App = () => {
  return (
    <div>
      <h1>Hello World</h1>
      <Button type="primary">Click me</Button>

      <div className="timetable-container">
        <AntTable />
      </div>
    </div>
  );
};

export default App;
