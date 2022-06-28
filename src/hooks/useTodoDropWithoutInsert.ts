import { ConnectDropTarget, useDrop } from 'react-dnd';

import DndTypes from '../components/todo/dnd/DndTypes';
import { ITodo } from '../models/ITodo';
import { TodoListId } from '../models/ITodoList';
import { selectTodoIdsByListId } from '../store/todo/todoSlice';
import { useAppSelector } from './reduxHooks';

interface ITodoDropCollectProps {
  isOver: boolean,
  draggedTodo: ITodo
}

export default function useTodoDropWithoutInsert(listId: TodoListId)
  : [ITodoDropCollectProps, ConnectDropTarget] {
  const todoIds = useAppSelector((state) => selectTodoIdsByListId(state, listId));

  const [collect, drop] = useDrop<ITodo, any, ITodoDropCollectProps>(
    () => ({
      accept: DndTypes.CARD,
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
        draggedTodo: monitor.getItem(),
      }),
    }),
    [todoIds.length],
  );

  return [collect, drop];
}
