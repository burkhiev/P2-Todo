import { ITodo } from '../../models/ITodo';
import { POSITION_STEP } from '../../service/Consts';
import InvalidArgumentError from '../../service/errors/InvalidArgumentError';
import OutOfRangeError from '../../service/errors/OutOfRangeError';
import { IMoveTodoPayload } from './todoSlice';

/**
 * Вычисляет новую позицию todo при смене позиции.
 * @param initTodos Массив всех доступных todo.
 * @param moveInfo Информация о смене позиции todo.
 * @returns Новая значение позиции. Если todo не меняет
 * своей позиции, то возвращает undefined.
 */
export function getNewTodoPosition(initTodos: ITodo[], moveInfo: IMoveTodoPayload) {
  const {
    todoId,
    destIndex,
    destListId,
    srcIndex,
    srcListId,
  } = moveInfo;

  let prevPos = 0;
  let nextPos = 0;
  let newPos = POSITION_STEP;

  const todos = initTodos
    .filter((t) => t.listId === destListId)
    .sort((a, b) => a.position - b.position);

  const todo = initTodos.find((t) => t.id === todoId);

  if (!todo) {
    throw new InvalidArgumentError('There are no todos with specified ID.');
  }

  if (destIndex < 0 || todos.length < destIndex) {
    throw new OutOfRangeError('\'destinationIndex\' arg is out of range.');
  }

  if (srcListId === destListId) {
    if (srcIndex === destIndex) {
      return undefined;
    }

    if (destIndex === (todos.length - 1)) {
      newPos = todos[destIndex].position + POSITION_STEP;
    } else if (destIndex === 0) {
      newPos = todos[0].position / 2;
    } else {
      if (destIndex < srcIndex) {
        prevPos = todos[destIndex - 1].position;
        nextPos = todos[destIndex].position;
      } else {
        prevPos = todos[destIndex].position;
        nextPos = todos[destIndex + 1].position;
      }

      newPos = (prevPos + nextPos) / 2;
    }
  } else if (todos.length === 0) {
    newPos = POSITION_STEP;
  } else if (destIndex === todos.length) {
    newPos = todos[todos.length - 1].position + POSITION_STEP;
  } else if (destIndex === 0) {
    newPos = todos[0].position / 2;
  } else {
    prevPos = todos[destIndex - 1].position;
    nextPos = todos[destIndex].position;
    newPos = (prevPos + nextPos) / 2;
  }

  return newPos;
}

export default { getNewTodoPosition };
