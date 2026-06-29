import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:5029/api", // свой порт поставь
});

export async function getBoardNotes(boardId: string) {
  const response = await api.get(`/board/${boardId}/notes`);
  return response.data;
}

export async function updateNotePosition(
  noteId: string,
  positionX: number,
  positionY: number
) {
  await api.put(`/note/${noteId}/position`, {
    positionX,
    positionY,
  });
}

export async function deleteNote(id: string) {
  await api.delete(`/note/${id}`);
}


export async function getBoardConnections(boardId: string) {
  const response = await api.get(`/NoteConnection/${boardId}`);
  return response.data;
}

export async function createConnection(
  noteFrom: string,
  noteTo: string
) {
  const response = await api.post(
    `/NoteConnection?noteFrom=${noteFrom}&noteTo=${noteTo}`
  );

  return response.data;
}


export async function createNote(boardId: string) {
  const response = await api.post("/note", {
    title: "New Evidence",
    content: "Description...",
    boardId: boardId,
  });

  return response.data;
}

export async function updateNote(
  id: string,
  title: string,
  content: string,
  color: string
) {
  const response = await api.put(`/note/${id}`, {
    title,
    content,
    color,
  });

  return response.data;
}