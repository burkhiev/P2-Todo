export type TodoId = string;

export interface ITodo {
  todoId: TodoId,
  columnId: string,
  title: string,
  description?: string
}
