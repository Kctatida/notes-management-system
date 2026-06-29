import { useEffect, useState, useCallback } from "react";
import {
  getBoardNotes,
  getBoardConnections,
  createConnection,
  updateNotePosition,
  createNote,
  updateNote,
  deleteNote,
} from "./api/notesApi";



import ReactFlow, {
  Background,
  Controls,
  ReactFlowProvider,
  applyNodeChanges,
  applyEdgeChanges,
  type Node,
  type Edge,
  type OnNodesChange,
  type OnEdgesChange,
  type OnConnect,
  type Connection,
} from "reactflow";

import "reactflow/dist/style.css";

import NoteNode from "./components/NoteNode";

const nodeTypes = {
  noteNode: NoteNode,
};

const boardId = "885C51AA-D96C-4DDA-BB34-E77A9FB46081";





export default function App() {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [editingNodeId, setEditingNodeId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

const [selectedNoteId, setSelectedNoteId] =
  useState<string | null>(null);

const [title, setTitle] = useState("");
const [content, setContent] = useState("");
const [color, setColor] = useState("#FDE68A");

const openEditor = (node: Node) => {
  setSelectedNoteId(node.id);

  setTitle(node.data.title);
  setContent(node.data.content);
  setColor(node.data.color || "#FDE68A");
};

const saveNote = async () => {
  if (!selectedNoteId) return;

  await updateNote(
    selectedNoteId,
    title,
    content,
    color 
  );

  await loadNotes();

  setSelectedNoteId(null);
};
  
  // ===== LOAD NOTES =====
  const loadNotes = useCallback(async () => {
    try {
      console.log("LOAD START");

      const notes = await getBoardNotes(boardId);

      console.log("NOTES:", notes);

      const reactFlowNodes: Node[] = notes.map((note: any) => ({
        id: String(note.id),
        type: "noteNode",
        position: {
          x: Number(note.positionX ?? 0),
          y: Number(note.positionY ?? 0),
        },
        data: {
          id: note.id,
          title: note.title ?? "",
          content: note.content ?? "",
          color: note.color ?? "#FDE68A",
          onDelete: () => removeNote(String(note.id)),

          onEdit: (id: string) => {
            const current = reactFlowNodes.find(
              (x) => x.id === id
            );

            if (current)
              openEditor(current);
          },
        }
      }));

      setNodes(reactFlowNodes);

      const connections = await getBoardConnections(boardId);

      const reactFlowEdges: Edge[] = connections.map((c: any) => ({
        id: String(c.id),
        source: String(c.fromNoteId),
        target: String(c.toNoteId),
      }));

      setEdges(reactFlowEdges);
      
      console.log("NODES LOADED:", reactFlowNodes);
    } catch (error) {
      console.error("LOAD ERROR:", error);
    }
  }, []);

  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  // ===== NODES =====
  const onNodesChange: OnNodesChange = useCallback(
    (changes) => {
      setNodes((nds) => applyNodeChanges(changes, nds));
    },
    []
  );

  // ===== EDGES =====
  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => {
      setEdges((eds) => applyEdgeChanges(changes, eds));
    },
    []
  );
// ===ADD===
const addNote = async () => {
  try {
    const note = await createNote(boardId);

    const newNode: Node = {
      id: String(note.id),
      type: "noteNode",
      position: {
        x: note.positionX,
        y: note.positionY,
      },
      data: {
        title: note.title,
        content: note.content,
        color: note.color,
        onDelete: () => removeNote(String(note.id)),
      },
    };

    setNodes((prev) => [...prev, newNode]);
  } catch (error) {
    console.error(error);
  }
};




  // ===== CONNECT =====
  const onConnect: OnConnect = useCallback(
  async (connection: Connection) => {
    if (!connection.source || !connection.target)
      return;

    try {
      const savedConnection =
        await createConnection(
          connection.source,
          connection.target
        );

      setEdges((eds) => [
        ...eds,
        {
          id: String(savedConnection.id),
          source: connection.source!,
          target: connection.target!,
        },
      ]);
    } catch (error) {
      console.error(error);
    }
  },
  []
);

  const removeNote = async (id: string) => {
  try {
    await deleteNote(id);

    setNodes((prev) =>
      prev.filter((node) => node.id !== id)
    );

    setEdges((prev) =>
      prev.filter(
        (edge) =>
          edge.source !== id &&
          edge.target !== id
      )
    );
  } catch (error) {
    console.error(error);
  }
};



  // ===== DRAG STOP =====
  const onNodeDragStop = useCallback(
  async (_event: any, node: Node) => {
    setNodes((prev) =>
      prev.map((n) =>
        n.id === node.id
          ? { ...n, position: node.position }
          : n
      )
    );

    try {
      await updateNotePosition(
        node.id,
        node.position.x,
        node.position.y
      );

      console.log("POSITION SAVED");
    } catch (error) {
      console.error(error);
    }
  },
  []
);

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <ReactFlowProvider>
        
        <button
  onClick={addNote}
  style={{
    position: "absolute",
    top: 10,
    left: 10,
    zIndex: 1000,
    padding: "10px 16px",
    borderRadius: 8,
    border: "none",
    cursor: "pointer",
  }}
>
  + Add Evidence
</button>
{editingNodeId && (
  <div
    style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.4)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 2000,
    }}
  >
    <div
      style={{
        background: "white",
        padding: 20,
        borderRadius: 12,
        width: 400,
      }}
    >
      <h2>Edit Note</h2>

      <input
        value={editTitle}
        onChange={(e) => setEditTitle(e.target.value)}
        placeholder="Title"
        style={{
          width: "100%",
          marginBottom: 10,
          padding: 8,
        }}
      />

      <textarea
        value={editContent}
        onChange={(e) => setEditContent(e.target.value)}
        placeholder="Content"
        style={{
          width: "100%",
          height: 120,
          marginBottom: 10,
          padding: 8,
        }}
      />



      <div
        style={{
          marginTop: 15,
          display: "flex",
          gap: 10,
        }}
      >
        <button onClick={saveNote}>
          Save
        </button>

        <button onClick={() => setEditingNodeId(null)}>
          Cancel
        </button>
      </div>
    </div>
  </div>
)}
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeDragStop={onNodeDragStop}
          fitView
        >
          <Background />
          <Controls />
        </ReactFlow>
        {selectedNoteId && (
  <div
    style={{
      position: "absolute",
      right: 0,
      top: 0,
      width: 300,
      height: "100%",
      background: "white",
      padding: 20,
      borderLeft: "1px solid #ddd",
      zIndex: 1000,
    }}
  >
    <input
      value={title}
      onChange={(e) => setTitle(e.target.value)}
      style={{ width: "100%" }}
    />

    <textarea
      value={content}
      onChange={(e) => setContent(e.target.value)}
      style={{
        width: "100%",
        height: 200,
        marginTop: 10,
      }}
    />

    <button
      onClick={saveNote}
      style={{ marginTop: 10 }}
    >
      Save
    </button>
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
        />
  </div>
)}

      </ReactFlowProvider>
    </div>
  );
}