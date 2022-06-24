export type TodoId = string;

export interface ITodo {
  todoId: TodoId,
  listId: string,
  title: string,
  description?: string
}
