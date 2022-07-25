import { ResourceObject } from 'ts-json-api';
import { TodoTableId } from '../ITodoTable';

export default interface ITodoTableResource extends ResourceObject {
  type: 'table',
  id: TodoTableId,
  attributes?: {
    name: string
  }
// что тут происходит?
// eslint-disable-next-line semi
}
