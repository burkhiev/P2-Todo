import { ResourceObject } from 'ts-json-api';
import { TodoId } from '../ITodo';
import { TodoListId } from '../ITodoList';

export default interface ITodoResource extends ResourceObject {
  type: 'todo',
  id: TodoId,
  attributes?: {
    title: string,
    description?: string,
    position: number,
    listId: TodoListId,
    addedAt: string,
  }
// eslint-disable-next-line semi
}
