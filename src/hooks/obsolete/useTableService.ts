/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback } from 'react';

import { TodoId } from '../../models/ITodo';
import { INVALID_TABLE_ID } from '../../service/Consts';
import { selectTableById } from '../../store/api/apiSlice';
import { removeManyLists, selectListIdsByTableId } from '../../store/todo/listSlice';
import {
  createTable, deleteTable, updateTable as editTable,
} from '../../store/obsolete/tableSlice';
import { removeManyTodo, selectTodoIdsByTableId } from '../../store/todo/todoSlice';
import { useAppDispatch, useAppSelector } from '../reduxHooks';

const INVALID_TABLE_ERR_MSG = 'Invalid operation error. Invalid "table" arg.';

export default function useTableService(tableId: TodoId = INVALID_TABLE_ID) {
  const table = useAppSelector((state) => selectTableById(state, tableId));

  const dispatch = useAppDispatch();

  const addTable = useCallback((name: string) => {
    const { payload: newTable } = dispatch(createTable(name));
    return newTable.id;
  }, [dispatch]);

  const updateTable = useCallback((name: string) => {
    if (!table) {
      throw new Error(INVALID_TABLE_ERR_MSG);
    }

    dispatch(editTable({
      id: table.id,
      changes: { name },
    }));
  }, [dispatch, table?.id]);

  const tableListIds = useAppSelector((state) =>
    selectListIdsByTableId(state, table?.id ?? INVALID_TABLE_ID));
  const tableTodoIds = useAppSelector((state) =>
    selectTodoIdsByTableId(state, table?.id ?? INVALID_TABLE_ID));

  const removeTable = useCallback(() => {
    if (!table) {
      throw new Error(INVALID_TABLE_ERR_MSG);
    }

    dispatch(removeManyTodo(tableTodoIds));
    dispatch(removeManyLists(tableListIds));
    dispatch(deleteTable(table.id));
  }, [dispatch, table?.id]);

  return {
    addTable,
    updateTable,
    removeTable,
  };
}
