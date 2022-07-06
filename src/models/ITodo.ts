export type TodoId = string;

export interface ITodo {
  id: TodoId,
  listId: string,
  title: string,
  description?: string,
  addedAt: string,
  position: number
}
