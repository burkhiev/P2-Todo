import { TodoId } from './ITodo';
import { TodoListId } from './ITodoList';

export default interface IMoveTodoPayload {
  todoId: TodoId,
  srcListId: TodoListId,
  srcIndex: number,
  destListId: TodoListId,
  destIndex: number
// eslint-disable-next-line semi
}
