import { ResourceObject } from 'ts-json-api';
import { TodoId } from '../ITodo';
import { TodoListId } from '../ITodoList';

export default interface IMoveTodoResource extends ResourceObject {
  type: 'move-todo',
  id: TodoId,
  attributes: {
    srcListId: TodoListId,
    srcIndex: number,
    destListId: TodoListId,
    destIndex: number
  }
// eslint-disable-next-line semi
}
