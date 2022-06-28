import { ConnectDropTarget, useDrop } from 'react-dnd';

import DndTypes from '../components/todo/dnd/DndTypes';
import { ITodo } from '../models/ITodo';
import { TodoListId } from '../models/ITodoList';
import { addTodoInListOrder, selectOrderedTodoIdsByListId } from '../store/todo/todosOrderSlice';
import { useAppDispatch, useAppSelector } from './reduxHooks';

interface ITodoDropCollectProps {
  isOver: boolean,
  draggedTodo: ITodo
}

export default function useTodoDrop(listId: TodoListId, insertBeforeTodoIndex?: number)
  : [ITodoDropCollectProps, ConnectDropTarget] {
  const dispatch = useAppDispatch();

  const todoIds = useAppSelector((state) => selectOrderedTodoIdsByListId(state, listId));

  const [collect, drop] = useDrop<ITodo, any, ITodoDropCollectProps>(
    () => ({
      accept: DndTypes.CARD,
      drop: ({ todoId }) => {
        dispatch(addTodoInListOrder({
          listId,
          todoId,
          index: insertBeforeTodoIndex,
        }));
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
        draggedTodo: monitor.getItem(),
      }),
    }),
    [todoIds],
  );

  return [collect, drop];
}
