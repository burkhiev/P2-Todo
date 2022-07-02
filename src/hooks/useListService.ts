import { TodoListId } from '../models/ITodoList';
import { removeManyTodo, selectTodoIdsByListId } from '../store/todo/todoSlice';
import { useAppDispatch, useAppSelector } from './reduxHooks';
import {
  removeList as removeListAction,
  updateList as updateListAction,
} from '../store/todo/listSlice';

export default function useListService(listId: TodoListId) {
  const dispatch = useAppDispatch();

  const todoIds = useAppSelector((state) => selectTodoIdsByListId(state, listId));

  function removeList() {
    dispatch(removeManyTodo(todoIds));
    dispatch(removeListAction(listId));
  }

  function updateList(title: string) {
    dispatch(updateListAction({
      id: listId,
      changes: { title },
    }));
  }

  return { removeList, updateList };
}
