/* eslint-disable @typescript-eslint/no-unused-vars */
import { TodoId } from '../models/ITodo';
import { TodoListId } from '../models/ITodoList';
import { TodoTableId } from '../models/ITodoTable';

export const POSITION_STEP = 2 ** 16;
export const MIN_POSITION = 0;
export const MAX_POSITION = (2 ** 32) - 1;
export const MAX_POSITION_FRACTION_DIGITS_NUMBER = 3;

export const INVALID_TABLE_ID: TodoTableId = 'INVALID_TABLE_ID';
export const INVALID_LIST_ID: TodoListId = 'INVALID_LIST_ID';

export const NEW_TODO_ID: TodoId = 'NEW_TODO_ID';

const developmentUrl = 'http://127.0.0.1:5500';
// const deploymentUrl = 'https://burkhiev.github.io/';

export const SITE_URL = developmentUrl;

const mainProductionPath = '/';
const mainDevelopmentPath = '/build';
const mainDeploymentPath = '/P2-Todo-client-browser';

export const MAIN_PATH = mainDevelopmentPath;
