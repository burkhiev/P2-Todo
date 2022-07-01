import { TodoListId } from '../models/ITodoList';
import { removeManyTodo, selectTodoIdsByListId } from '../store/todo/todoSlice';
import { useAppDispatch, useAppSelector } from './reduxHooks';
import { removeList, updateList } from '../store/todo/listSlice';

export default function useListService(listId: TodoListId) {
  const dispatch = useAppDispatch();

  const todoIds = useAppSelector((state) => selectTodoIdsByListId(state, listId));

  function onRemoveList() {
    dispatch(removeManyTodo(todoIds));
    dispatch(removeList(listId));
  }

  function onEditList(title: string) {
    dispatch(updateList({
      id: listId,
      changes: { title },
    }));
  }

  return { onRemoveList, onEditList };
}
