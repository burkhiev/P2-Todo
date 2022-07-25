import { ResourceObject } from 'ts-json-api';
import { TodoTableId } from '../ITodoTable';

export default interface ITodoListResource extends ResourceObject {
  type: 'list',
  attributes?: {
    title: string,
    tableId: TodoTableId,
    position: number
  }
// eslint-disable-next-line semi
}
