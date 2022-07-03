import { ConnectDragSource, useDrag } from 'react-dnd';

import DndTypes from '../../service/DndTypes';
import { ITodo, TodoId } from '../../models/ITodo';
import { selectTodoById } from '../../store/todo/todoSlice';
import { useAppSelector } from '../reduxHooks';

interface ITodoDragCollectProps {
  isDragging: boolean
}

export default function useTodoDrag(todoId: TodoId): [ITodoDragCollectProps, ConnectDragSource] {
  const todo = useAppSelector((state) => selectTodoById(state, todoId));

  const [collect, drag] = useDrag<ITodo, any, ITodoDragCollectProps>(() => ({
    type: DndTypes.CARD,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
    item: todo,
  }));

  return [collect, drag];
}
