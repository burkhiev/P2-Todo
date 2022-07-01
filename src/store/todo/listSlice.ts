import {
  createSlice,
  createEntityAdapter,
  PayloadAction,
  nanoid,
} from '@reduxjs/toolkit';

import {
  MAX_POSITION_FRACTION_DIGITS_NUMBER,
  POSITION_STEP,
} from '../../service/Consts';

import { RootState } from '../store';
import { ITodoList, TodoListId } from '../../models/ITodoList';
import { TodoTableId } from '../../models/ITodoTable';
import TodoMocks from '../../service/mocks/TodoMocks';
import MathService from '../../service/MathService';
import { TodoListDropSide } from '../../components/todo/table/Table';

interface IMoveListPayload {
  /**
   * Id списка который взят посредством Drag and Drop.
   */
  draggedListId: TodoListId,
  /**
   * Id списка рядом с которым находится взятый
   * с помощью Drag and Drop список.
   */
  targetListId: TodoListId,
  /**
   * Будущая позиция вставляемого списка относительно
   * списка с id = targetListId.
   */
  dropSide: TodoListDropSide
}

const listAdapter = createEntityAdapter<ITodoList>({
  selectId: (list) => list.listId,
  sortComparer: (a, b) => a.position - b.position,
});

const emptyInitialState = listAdapter.getInitialState();
const initialState = listAdapter.setAll(emptyInitialState, TodoMocks.lists);

const listSlice = createSlice({
  name: 'list',
  initialState,
  reducers: {
    addList: {
      reducer(state, action: PayloadAction<ITodoList>) {
        const list = action.payload;
        const lists = Object.values(state.entities);

        const maxPosition = lists
          .map((cur) => cur?.position)
          .reduce((prev, cur) => Math.max(prev ?? 0, cur ?? 0), 0) ?? 0;

        list.position = maxPosition + POSITION_STEP;
        listAdapter.addOne(state, list);
      },
      prepare(tableId: TodoTableId, title: string): PayloadAction<ITodoList> {
        return {
          payload: {
            listId: nanoid(),
            title,
            tableId,
            position: 0,
          },
          type: 'list/addList',
        };
      },
    },
    removeList: listAdapter.removeOne,
    updateList: listAdapter.updateOne,
    moveList(state, action: PayloadAction<IMoveListPayload>) {
      const { draggedListId, targetListId, dropSide } = action.payload;

      const draggedList = state.entities[draggedListId];
      const targetList = state.entities[targetListId];

      if (!draggedList) {
        throw new Error('Invalid argument error. Wrong "draggedList" payload arg.');
      }

      if (!targetList) {
        throw new Error('Invalid argument error. Wrong "targetList" payload arg.');
      }

      if (draggedListId === targetListId) {
        return;
      }

      const lists = Object.values(state.entities)
        .filter((curList) => curList?.tableId === draggedList.tableId)
        .sort((a, b) => (a?.position ?? 0) - (b?.position ?? 0));

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

      // console.group();
      // console.log('targetList:', targetList?.title);
      // console.log('nearbyList:', nearbyList?.title);
      // console.log('relativeSide', TodoListDropSide[dropSide]);
      // console.groupEnd();
      // console.group();
      // console.log('targetPos:', targetPos);
      // console.log('nearbyPos:', nearbyPos);
      // console.groupEnd();

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
      // Обновление производиться с шагом POSITION_STEP.
      //
      // Похожая логика работает в Trello.
      const numCount = MathService.countOfFractionalPartNumbers(newListPos);

      if (numCount <= MAX_POSITION_FRACTION_DIGITS_NUMBER) {
        listAdapter.updateOne(state, {
          id: draggedList.listId,
          changes: { position: newListPos },
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

            listAdapter.updateOne(state, {
              id: list.listId,
              changes: { position: newPos },
            });

            mult += 1;
          }
        }
      }

      // const resultLists = Object.values(state.entities)
      //   .filter(curList => curList?.tableId === draggedList.tableId)
      //   .sort((a, b) => (a?.position ?? 0) - (b?.position ?? 0));

      // resultLists.forEach(list => {
      //   console.log('title:', list?.title, '| position:', list?.position);
      //   console.log();
      // });
    },
  },
});

export default listSlice.reducer;

export const {
  addList,
  removeList,
  updateList,
  moveList,
} = listSlice.actions;

export const {
  selectAll: selectAllTodoLists,
  selectById: selectTodoListById,
} = listAdapter.getSelectors<RootState>((state) => state.todo.lists);

export const selectTodoListsByTableId = (state: RootState, tableId: TodoTableId) =>
  selectAllTodoLists(state)
    .filter((list) => list.tableId === tableId);

export const selectTodoListIdsByTableId = (state: RootState, tableId: TodoTableId) =>
  selectTodoListsByTableId(state, tableId)
    .map((list) => list.listId);
