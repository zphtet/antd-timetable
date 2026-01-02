import { useState, useCallback, useRef, useMemo, useEffect } from "react";
import {
  ReactFlow,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  Controls,
  MiniMap,
  type Node,
  type Edge,
  type ReactFlowInstance,
  type NodeChange,
  type EdgeChange,
  type Connection,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

const Canvas = ({ items }: { items: { key: string; label: string }[] }) => {
  const computedInitialNodes = useMemo<Node[]>(() => {
    const verticalSpacing = 100; // px between nodes vertically
    const startY = 50;
    const startX = 50;
    return (items ?? []).map((item, index) => ({
      id: item.key,
      position: { x: startX, y: startY + index * verticalSpacing },
      data: { label: item.label },
    }));
  }, [items]);

  const computedInitialEdges = useMemo<Edge[]>(() => {
    const edges: Edge[] = [];
    for (let i = 0; i < (items?.length ?? 0) - 1; i++) {
      const source = items[i].key;
      const target = items[i + 1].key;
      edges.push({ id: `${source}-${target}`, source, target });
    }
    return edges;
  }, [items]);

  const [nodes, setNodes] = useState<Node[]>(computedInitialNodes);
  const [edges, setEdges] = useState<Edge[]>(computedInitialEdges);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance<
    Node,
    Edge
  > | null>(null);

  // Recompute graph when items list changes
  useEffect(() => {
    setNodes(computedInitialNodes);
    setEdges(computedInitialEdges);
  }, [computedInitialNodes, computedInitialEdges]);

  const logNodePositions = () => {
    if (!reactFlowInstance) return;

    const currentNodes = reactFlowInstance.getNodes();
    const { x: panX, y: panY } = reactFlowInstance.getViewport(); // get current pan/zoom
    const zoom = reactFlowInstance.getZoom();

    currentNodes.forEach((node: Node) => {
      const renderedX = node.position.x * zoom + panX;
      const renderedY = node.position.y * zoom + panY;
      console.log(node.id, { x: renderedX, y: renderedY });
    });
  };

  const onNodesChange = useCallback(
    (changes: NodeChange[]) =>
      setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) =>
      setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );
  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    []
  );

  const onEdgeClick = (e: any, edge: any) => {
    console.log("edge clicked", e, edge);
  };

  const findUnconnected = () => {
    const nodes = reactFlowInstance?.getNodes();
    const edges = reactFlowInstance?.getEdges();
    if (!nodes || !edges) return;
    const unconnected = nodes.filter(
      (n) => !edges.some((e) => e.source === n.id || e.target === n.id)
    );

    console.log("🔹 Unconnected nodes:", unconnected);
  };

  return (
    <div ref={reactFlowWrapper} style={{ width: "100vw", height: "100vh" }}>
      <button onClick={logNodePositions}>Log Node Positions</button>
      <button onClick={findUnconnected}>Find Unconnected</button>
      <ReactFlow
        onNodeClick={(e: any, node: any) => {
          console.log("node clicked", e, node);
        }}
        onEdgeClick={onEdgeClick}
        onInit={setReactFlowInstance}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
};

export default Canvas;
