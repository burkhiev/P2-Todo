import { ConnectDropTarget, useDrop } from 'react-dnd';

import DndTypes from '../../DndTypes';
import { ITodo } from '../../models/ITodo';
import { TodoListId } from '../../models/ITodoList';
import { selectTodoIdsByListId } from '../../store/todo/todoSlice';
import { useAppSelector } from '../reduxHooks';

interface ITodoDropCollectProps {
  todoIsOver: boolean,
  draggedTodo: ITodo
}

export default function useTodoDropWithoutInsert(listId: TodoListId)
  : [ITodoDropCollectProps, ConnectDropTarget] {
  const todoIds = useAppSelector((state) => selectTodoIdsByListId(state, listId));

  const [collect, drop] = useDrop<ITodo, any, ITodoDropCollectProps>(
    () => ({
      accept: DndTypes.CARD,
      collect: (monitor) => ({
        todoIsOver: !!monitor.isOver(),
        draggedTodo: monitor.getItem(),
      }),
    }),
    [todoIds.length],
  );

  return [collect, drop];
}
