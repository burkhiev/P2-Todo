import { TodoListId } from '../models/ITodoList';
import { TodoTableId } from '../models/ITodoTable';

export const POSITION_STEP = 2 ** 16;
export const MIN_POSITION = 0;
export const MAX_POSITION = (2 ** 32) - 1;
export const MAX_POSITION_FRACTION_DIGITS_NUMBER = 3;

export const INVALID_TABLE_ID: TodoTableId = 'INVALID_TABLE_ID';
export const INVALID_LIST_ID: TodoListId = 'INVALID_LIST_ID';
