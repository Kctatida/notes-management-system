import { memo } from "react";
import { Handle, Position, type NodeProps } from "reactflow";

type NoteData = {
  id: string;
  title: string;
  content: string;
  color?: string;
  rotation?: number;
  onEdit?: (id: string) => void;
  onDelete?: () => void;
};

function NoteNode({ data }: NodeProps<NoteData>) {
  return (
    <div
    
      onDoubleClick={() => data.onEdit?.(data.id)}
      style={{
        padding: 10,
        position: "relative",
        minWidth: 160,
        borderRadius: 10,
        background: data.color ?? "#ffffff",
        border: "1px solid #ddd",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        transform: `rotate(${data.rotation ?? 0}deg)`,
        cursor: "pointer",
      }}
    >
      <div style={{ fontWeight: 700 }}>{data.title}</div>
      <div style={{ marginTop: 5 }}>{data.content}</div>

      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
      <button
        onClick={(e) => {
          e.stopPropagation();
          data.onDelete?.();
        }}
        style={{
          position: "absolute",
          top: 5,
          right: 5,
          border: "none",
          background: "transparent",
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        ✕
      </button>
    </div>
  );
}

export default memo(NoteNode);