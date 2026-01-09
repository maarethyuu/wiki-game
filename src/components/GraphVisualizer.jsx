import React, { useEffect, useMemo } from "react";
import ReactFlow, { Controls, useNodesState, useEdgesState } from "reactflow";
import "reactflow/dist/style.css";
import WikiNode from "./WikiNode";

export default function GraphVisualizer({
  customNodes,
  customEdges,
  onNodeClick,
}) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const nodeTypes = useMemo(() => ({ wikiNode: WikiNode }), []);

  useEffect(() => {
    if (customNodes && customEdges) {
      setNodes(customNodes);
      setEdges(customEdges);
    }
  }, [customNodes, customEdges, setNodes, setEdges]);

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        onNodeClick={onNodeClick}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        minZoom={0.5}
      >
        <Controls showInteractive={false} />
      </ReactFlow>
    </div>
  );
}
