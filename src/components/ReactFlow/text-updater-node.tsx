import { Handle, Position } from "@xyflow/react";
import { useCallback } from "react";


const TextUpdaterNode = ({data}) => {
    console.log("props", data);
    // const onChnage = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    //     console.log("onChnage", event.target.value);
    //     data.onChange(event.target.value);
    // }, []);
  return <div className="text-updater-node">
     <label htmlFor="text">Color Picker Node</label>
     <input type="color" defaultValue={data.color} name="text" onChange={data?.onChange} id="text" />
     <Handle type="source" position={Position.Bottom} />
     <Handle type="target" position={Position.Top} />
  </div>;
};

export default TextUpdaterNode;