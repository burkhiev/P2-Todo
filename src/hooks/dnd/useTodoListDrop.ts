import { ConnectDropTarget, useDrop } from 'react-dnd';

import DndTypes from '../../service/DndTypes';
import { IOnDropReturnType, TodoListDropSide } from '../../components/body/table/Table';
import { ITodoList } from '../../models/ITodoList';
import { selectAllLists, useMoveList } from '../../store/api/listSlice';
import { useAppSelector } from '../reduxHooks';
import InvalidArgumentError from '../../service/errors/InvalidArgumentError';
import { MAX_POSITION_FRACTION_DIGITS_NUMBER, POSITION_STEP } from '../../service/Consts';
import MathService from '../../service/MathService';
import ITodoListResource from '../../models/json-api-models/ITodoListResource';

function calculateNewListPosition(
  draggedList: ITodoList,
  targetList: ITodoList,
  listsFromState: ITodoList[],
  dropSide: TodoListDropSide,
) {
  if (!draggedList) {
    throw new InvalidArgumentError('Wrong "draggedList" payload arg.');
  }

  if (!targetList) {
    throw new InvalidArgumentError('Wrong "targetList" payload arg.');
  }

  if (draggedList.id === targetList.id) {
    throw new InvalidArgumentError('"draggedList" and "targetList" are equals.');
  }

  const lists = listsFromState.sort((a, b) => (a.position) - (b.position));

  // Поиск элемента, находящегося рядом с targetList со стороны relativeSide
  let nearbyList: ITodoList | undefined;

  const targetIndex = lists.indexOf(targetList);
  const draggedIndex = lists.indexOf(draggedList);

  function indexIsValid(index: number) {
    return (index >= 0 && index < lists.length);
  }

  if (dropSide === TodoListDropSide.AFTER) {
    let afterIndex = targetIndex + 1;

    if (afterIndex !== draggedIndex) {
      nearbyList = lists[afterIndex];
    } else {
      afterIndex += 1;

      if (indexIsValid(afterIndex)) {
        nearbyList = lists[afterIndex];
      }
    }
  } else {
    let afterIndex = targetIndex - 1;

    if (afterIndex !== draggedIndex) {
      nearbyList = lists[afterIndex];
    } else {
      afterIndex -= 1;

      if (indexIsValid(afterIndex)) {
        nearbyList = lists[afterIndex];
      }
    }
  }

  // Подготовка значений позиций для вставки
  const targetPos = targetList?.position;
  const nearbyPos = nearbyList?.position
    ?? (
      dropSide === TodoListDropSide.AFTER
        ? targetPos + 2 * POSITION_STEP
        : 0
    );

  if (targetPos && targetPos <= 0) {
    throw new Error('Todo list position cannot be less than zero.');
  }

  let newListPos: number;

  if (targetPos > nearbyPos) {
    newListPos = nearbyPos + (targetPos - nearbyPos) / 2;
  } else {
    newListPos = targetPos + (nearbyPos - targetPos) / 2;
  }

  // Если количество знаков в дробной части позиции
  // превышает определенный порог, обновляем все позиции
  // элементов идущих после обрабатываемых.
  // Обновление производится с шагом POSITION_STEP.
  //
  // Похожая логика работает в Trello.
  const numCount = MathService.countOfFractionalPartNumbers(newListPos);

  const data: ITodoListResource[] = [];

  if (numCount <= MAX_POSITION_FRACTION_DIGITS_NUMBER) {
    data.push({
      id: draggedList.id,
      type: 'list',
      attributes: {
        ...(draggedList as Omit<ITodoList, 'id'>),
        position: newListPos,
      },
    });
  } else {
    const newPosBegin = Math.ceil(Math.min(nearbyPos, targetPos));

    let mult = 1;
    let i = 0;

    if (nearbyList) {
      const nearbyIndex = lists.indexOf(nearbyList);
      i = nearbyIndex < targetIndex ? nearbyIndex : targetIndex;
    } else {
      i = targetIndex;
    }

    for (; i < lists.length; i += 1) {
      const list = lists[i];

      if (list) {
        const newPos = newPosBegin + POSITION_STEP * mult;

        data.push({
          id: draggedList.id,
          type: 'list',
          attributes: {
            ...(draggedList as Omit<ITodoList, 'id'>),
            position: newPos,
          },
        });

        mult += 1;
      }
    }
  }

  return data;
}

interface IUseTodoListDropCollectProps {
  listIsOver: boolean,
  draggedList: ITodoList,
  isLoading: boolean,
  isSuccess: boolean
}

export default function useTodoListDrop(
  onDrop: () => (IOnDropReturnType | undefined),
  deps?: any[],
): [IUseTodoListDropCollectProps, ConnectDropTarget] {
  // const appState = useAppSelector(state => state);
  const lists = useAppSelector(selectAllLists);

  const [moveList, {
    isLoading,
    isSuccess,
  }] = useMoveList();

  const loadDeps = [isLoading, isSuccess];

  const [collect, drop] = useDrop<ITodoList, any, IUseTodoListDropCollectProps>(
    () => ({
      accept: DndTypes.LIST,
      drop: async (draggedList) => {
        const dropInfo = onDrop();

        if (!dropInfo) {
          return;
        }

        // eslint-disable-next-line no-use-before-define
        const listResources = calculateNewListPosition(
          draggedList,
          dropInfo.list,
          lists,
          dropInfo.dropSide,
        );

        try {
          await moveList({ data: listResources }).unwrap();
        } catch (error) {
          // eslint-disable-next-line no-console
          console.log(error);
        }
      },
      collect: (monitor) => ({
        listIsOver: !!monitor.isOver(),
        draggedList: monitor.getItem(),
        isLoading,
        isSuccess,
      }),
    }),
    (deps ? [...deps, ...loadDeps] : [...loadDeps]),
  );

  return [collect, drop];
}
