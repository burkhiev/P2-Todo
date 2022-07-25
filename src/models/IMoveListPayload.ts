/* eslint-disable semi */
import { TodoListId } from './ITodoList';
import { TodoTableId } from './ITodoTable';

export default interface IMoveListPayload {
  listId: TodoListId,
  tableId: TodoTableId,
  srcIndex: number,
  destIndex: number
}
