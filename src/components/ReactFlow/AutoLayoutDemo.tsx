import React, { useState, useCallback, useRef, useEffect , useMemo } from 'react';
import { 
  ReactFlow,
  Background, 
  Controls, 
  MiniMap, 
  Panel,
  useNodesState,
  useEdgesState,
  addEdge,
  type Node as RFNode,
  type Edge as RFEdge,
  type ReactFlowInstance,
  type OnConnect
} from '@xyflow/react';
import { forceSimulation, forceManyBody, forceX, forceY, forceLink } from 'd3-force';
import '@xyflow/react/dist/style.css';

// Stable no-op to avoid recreating function each render
const NOOP = () => {};

// AutoLayout implementation
type AutoLayoutOptions = {
  direction?: 'horizontal' | 'vertical' | 'radial' | 'hierarchical';
  nodeSeparation?: number;
  rankSeparation?: number;
  iterations?: number;
  onLayoutComplete?: (nodes: RFNode[]) => void;
};

const useAutoLayout = ({
  direction = 'horizontal',
  nodeSeparation = 100,
  rankSeparation = 150,
  iterations = 300,
  onLayoutComplete = NOOP,
}: AutoLayoutOptions = {}) => {
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance<RFNode, RFEdge> | null>(null);
  const isLayingOutRef = useRef(false);
  
  const calculateLayout = useCallback(() => {
    if (!reactFlowInstance || isLayingOutRef.current) return;
    isLayingOutRef.current = true;
    
  type D3SimNode = RFNode & { id: string; x?: number; y?: number; data?: Record<string, unknown> };
  type D3LinkDatum = { source: string; target: string };

    const nodes = reactFlowInstance.getNodes() as RFNode[];
    const edges = reactFlowInstance.getEdges() as RFEdge[];
    const simNodes: D3SimNode[] = nodes as D3SimNode[];
    
    if (nodes.length === 0) return;
    
    const simulation = forceSimulation(simNodes as unknown as never)
      .force('charge', forceManyBody().strength(-Math.max(50, nodeSeparation)))
      .force(
        'link',
        forceLink(
          edges.map((edge) => ({ source: edge.source, target: edge.target })) as unknown as D3LinkDatum[] as never
        )
          .id((d: unknown) => (d as D3SimNode).id)
          .distance(rankSeparation)
      )
      .stop();
    
    if (direction === 'horizontal') {
      simulation
        .force('x', forceX().strength(0.05))
        .force('y', forceY().strength(0.3).y((d: D3SimNode) => (d.data?.rank as number | undefined ?? 0) * rankSeparation));
    } else if (direction === 'vertical') {
      simulation
        .force('x', forceX().strength(0.3).x((d: D3SimNode) => (d.data?.rank as number | undefined ?? 0) * rankSeparation))
        .force('y', forceY().strength(0.05));
    } else if (direction === 'radial') {
      // Basic simulation creates a radial-like layout
    } else if (direction === 'hierarchical') {
      const ranks: Record<string, number> = {};
      
      const targets = new Set(edges.map((e) => e.target));
      const rootNodeIds = nodes
        .filter(node => !targets.has(node.id))
        .map(node => node.id);
      
      const assignRanks = (nodeId: string, rank = 0) => {
        if (ranks[nodeId] === undefined || rank < ranks[nodeId]) {
          ranks[nodeId] = rank;
          
          edges
            .filter((edge) => edge.source === nodeId)
            .forEach((edge) => assignRanks(edge.target, rank + 1));
        }
      };
      
      rootNodeIds.forEach(nodeId => assignRanks(nodeId));
      
      simulation
        .force('x', forceX().strength(0.3).x((d: D3SimNode) => (ranks[d.id] ?? 0) * rankSeparation))
        .force('y', forceY().strength(0.05));
    }
    
    simulation.alpha(1).tick(iterations);
    
    const updatedNodes = simNodes.map((node) => {
      const x = isNaN((node as D3SimNode).x as number) ? 0 : ((node as D3SimNode).x as number);
      const y = isNaN((node as D3SimNode).y as number) ? 0 : ((node as D3SimNode).y as number);
      
      return {
        ...node,
        position: {
          x,
          y,
        },
      };
    });
    
    // Only update if positions actually changed to avoid loops
    const hasPositionChanged = nodes.some((node, idx) => {
      const updated = updatedNodes[idx];
      return node.position?.x !== updated.position.x || node.position?.y !== updated.position.y;
    });

    if (hasPositionChanged) {
      reactFlowInstance.setNodes(updatedNodes);
      onLayoutComplete(updatedNodes);
    }

    isLayingOutRef.current = false;
    
  }, [reactFlowInstance, direction, rankSeparation, iterations, nodeSeparation, onLayoutComplete]);
  
  return { calculateLayout, setReactFlowInstance };
};

// Custom Node Component
type CustomNodeProps = { data: { label: string } };
const CustomNode = ({ data }: CustomNodeProps) => {
  return (
    <div 
      style={{
        background: '#fff',
        border: '1px solid #1a192b',
        borderRadius: '3px',
        padding: 10,
        width: 150,
        fontSize: 12,
        color: '#333',
        textAlign: 'center',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
      }}
    >
      <div 
        style={{ 
          position: 'absolute', 
          top: '-5px', 
          left: '50%', 
          transform: 'translateX(-50%)',
          width: '10px',
          height: '10px',
          borderRadius: '50%',
          background: '#555',
        }}
      />
      <div>{data.label}</div>
      <div 
        style={{ 
          position: 'absolute', 
          bottom: '-5px', 
          left: '50%', 
          transform: 'translateX(-50%)',
          width: '10px',
          height: '10px',
          borderRadius: '50%',
          background: '#555',
        }}
      />
    </div>
  );
};

// Generate a demo flow
const generateDemoFlow = () => {
  const nodes = [];
  const edges = [];
  
  // Create nodes
  for (let i = 1; i <= 12; i++) {
    nodes.push({
      id: `${i}`,
      data: { label: `Node ${i}` },
      position: { x: 0, y: 0 },
    });
  }
  
  // Create connections
  edges.push({ id: 'e1-2', source: '1', target: '2' });
  edges.push({ id: 'e1-3', source: '1', target: '3' });
  edges.push({ id: 'e1-4', source: '1', target: '4' });
  
  edges.push({ id: 'e2-5', source: '2', target: '5' });
  edges.push({ id: 'e2-6', source: '2', target: '6' });
  edges.push({ id: 'e3-7', source: '3', target: '7' });
  edges.push({ id: 'e4-8', source: '4', target: '8' });
  
  edges.push({ id: 'e5-9', source: '5', target: '9' });
  edges.push({ id: 'e6-9', source: '6', target: '9' });
  edges.push({ id: 'e7-10', source: '7', target: '10' });
  edges.push({ id: 'e8-11', source: '8', target: '11' });
  
  edges.push({ id: 'e9-12', source: '9', target: '12' });
  edges.push({ id: 'e10-12', source: '10', target: '12' });
  edges.push({ id: 'e11-12', source: '11', target: '12' });
  
  return { nodes, edges };
};

// Main App Component
export default function AutoFlowDemo() {
  const { nodes: initialNodes, edges: initialEdges } = generateDemoFlow();
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [layoutDirection, setLayoutDirection] = useState<'horizontal' | 'vertical' | 'radial' | 'hierarchical'>('horizontal');
  const [nodeSeparation, setNodeSeparation] = useState(150);
  const [rankSeparation, setRankSeparation] = useState(200);
  
  const { calculateLayout, setReactFlowInstance } = useAutoLayout({
    direction: layoutDirection,
    nodeSeparation,
    rankSeparation,
    iterations: 300,
  });
  
  const onConnect = useCallback<OnConnect>((params) => {
    setEdges((eds) => addEdge(params, eds));
  }, [setEdges]);
  
  const handleLayoutChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLayoutDirection(e.target.value as 'horizontal' | 'vertical' | 'radial' | 'hierarchical');
  };
  
  const handleNodeSeparationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNodeSeparation(parseInt(e.target.value, 10));
  };
  
  const handleRankSeparationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRankSeparation(parseInt(e.target.value, 10));
  };
  
  const onInit = useCallback((instance: unknown) => {
    setReactFlowInstance(instance as ReactFlowInstance<RFNode, RFEdge>);
    setTimeout(() => {
      (instance as ReactFlowInstance).fitView({ padding: 0.2 });
    }, 100);
  }, [setReactFlowInstance]);
  
  useEffect(() => {
    calculateLayout();
  }, [calculateLayout, layoutDirection, nodeSeparation, rankSeparation]);
  
  const nodeTypes = useMemo(() => ({ customNode: CustomNode }), []);
  
  return (
    <div style={{ width: '100%', height: '500px' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        onInit={onInit}
        fitView
      >
        <Background />
        <Controls />
        <MiniMap />
        
        <Panel position="top-left" style={{ background: 'white', padding: '10px', borderRadius: '5px' }}>
          <h3>AutoLayout Demo</h3>
          <div style={{ marginBottom: '10px' }}>
            <label style={{ marginRight: '10px' }}>Layout:</label>
            <select value={layoutDirection} onChange={handleLayoutChange}>
              <option value="horizontal">Horizontal</option>
              <option value="vertical">Vertical</option>
              <option value="hierarchical">Hierarchical</option>
              <option value="radial">Radial</option>
            </select>
          </div>
          
          <div style={{ marginBottom: '10px' }}>
            <label style={{ marginRight: '10px' }}>Node Separation:</label>
            <input 
              type="range" 
              min="50" 
              max="250" 
              value={nodeSeparation} 
              onChange={handleNodeSeparationChange}
            />
            <span>{nodeSeparation}px</span>
          </div>
          
          <div style={{ marginBottom: '10px' }}>
            <label style={{ marginRight: '10px' }}>Rank Separation:</label>
            <input 
              type="range" 
              min="100" 
              max="400" 
              value={rankSeparation} 
              onChange={handleRankSeparationChange}
            />
            <span>{rankSeparation}px</span>
          </div>
          
          <button 
            onClick={calculateLayout}
            style={{
              padding: '5px 10px',
              background: '#1a192b',
              color: 'white',
              border: 'none',
              borderRadius: '3px',
              cursor: 'pointer'
            }}
          >
            Apply Layout
          </button>
        </Panel>
      </ReactFlow>
    </div>
  );
}
