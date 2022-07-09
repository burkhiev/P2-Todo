import { ResourceObject } from 'ts-json-api';

export default interface ITodoTableResource extends ResourceObject {
  type: 'table',
  attributes?: {
    name: string
  }
// что тут происходит?
// eslint-disable-next-line semi
}
