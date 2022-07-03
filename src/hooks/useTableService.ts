/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback } from 'react';

import { TodoId } from '../models/ITodo';
import { INVALID_TABLE_ID } from '../service/Consts';
import { removeManyLists, selectListIdsByTableId } from '../store/todo/listSlice';
import {
  createTable, deleteTable, selectTableById, updateTable as editTable,
} from '../store/todo/tableSlice';
import { removeManyTodo, selectTodoIdsByTableId } from '../store/todo/todoSlice';
import { useAppDispatch, useAppSelector } from './reduxHooks';

const INVALID_TABLE_ERR_MSG = 'Invalid operation error. Invalid "table" arg.';

export default function useTableService(tableId: TodoId = INVALID_TABLE_ID) {
  const table = useAppSelector((state) => selectTableById(state, tableId));

  const dispatch = useAppDispatch();

  const addTable = useCallback((name: string) => {
    const { payload: newTable } = dispatch(createTable(name));
    return newTable.tableId;
  }, [dispatch]);

  const updateTable = useCallback((name: string) => {
    if (!table) {
      throw new Error(INVALID_TABLE_ERR_MSG);
    }

    dispatch(editTable({
      id: table.tableId,
      changes: { name },
    }));
  }, [dispatch, table?.tableId]);

  const tableListIds = useAppSelector((state) =>
    selectListIdsByTableId(state, table?.tableId ?? INVALID_TABLE_ID));
  const tableTodoIds = useAppSelector((state) =>
    selectTodoIdsByTableId(state, table?.tableId ?? INVALID_TABLE_ID));

  const removeTable = useCallback(() => {
    if (!table) {
      throw new Error(INVALID_TABLE_ERR_MSG);
    }

    dispatch(removeManyTodo(tableTodoIds));
    dispatch(removeManyLists(tableListIds));
    dispatch(deleteTable(table.tableId));
  }, [dispatch, table?.tableId]);

  return {
    addTable,
    updateTable,
    removeTable,
  };
}
