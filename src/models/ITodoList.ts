export type TodoListId = string;

export interface ITodoList {
  id: TodoListId,
  tableId: string,
  title: string,
  position: number
}
