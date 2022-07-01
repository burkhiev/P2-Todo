export type TodoListId = string;

export interface ITodoList {
  listId: TodoListId,
  tableId: string,
  title: string,
  position: number
}
