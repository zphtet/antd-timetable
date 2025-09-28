import { useState, useCallback , useEffect} from "react";
import {
  ReactFlow,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  Controls,
  MiniMap
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import TextUpdaterNode from "./text-updater-node";
import CustomEdge from "./custom-edge";

const initialNodes = [
  { id: "n1", position: { x: 0, y: 0 }, data: { label: "1" } },
  { id: "n2", position: { x: 0, y: 100 },type : "textUpdater", data: { label: "2" } },
  {id : "n3", position : {x : 100, y : 200}, data : {label : "3"}},
];

const initialEdges = [{ id: "n1-n2", source: "n1", target: "n2" , type : "custom"}];

const nodeTypes = {
   textUpdater : TextUpdaterNode,
}
const edgeTypes = {
  custom : CustomEdge
}
const ReactFlowTest = () => {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const [color, setColor] = useState("#CFA0A0");

  console.log("all edges", edges)

  useEffect(() => {
       setNodes(initialNodes=>{
           return initialNodes.map((node)=>{
               if(node.type !== 'textUpdater'){
                  return node
               }
               return {
                  ...node,
                  data : {
                    ...node.data,
                    color : color,
                     onChange : (event: React.ChangeEvent<HTMLInputElement>) => {
                      setColor(event.target.value)
                     }
                  }
               }
           })
       })
  }, [])

  const onNodesChange = useCallback(
    (changes) =>
      setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    []
  );

  const onEdgesChange = useCallback(
    (changes) =>
      setEdges((edgesSnapshot) => {
        console.log("edge changes", changes , edgesSnapshot)
          return applyEdgeChanges(changes, edgesSnapshot)
      }),
    []
  );
  const onConnect = useCallback((params) => setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)), []);
  return (
    <div style={{width : "100vw", height : "100vh" , position : "relative"}}>
       <div style={{position : "absolute", top : 0, right : 0 , zIndex : 1000}}
       >
          <button  onClick={() => setColor("#CFA0A0")}>Reset Color</button>
       </div>
      <ReactFlow 
       nodes={nodes}
       edges={edges}
       onNodesChange={onNodesChange}
       onEdgesChange={onEdgesChange}
       onConnect={onConnect}
       fitView
       nodeTypes={nodeTypes}
       edgeTypes={edgeTypes}
       style={{backgroundColor : color}}
       >
        <Controls />
        <MiniMap />
       </ReactFlow>
    </div>
  );
};

export default ReactFlowTest;
