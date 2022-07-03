import { ConnectDragSource, useDrag } from 'react-dnd';

import DndTypes from '../../service/DndTypes';
import { ITodoList, TodoListId } from '../../models/ITodoList';
import { selectTodoListById } from '../../store/todo/listSlice';
import { useAppSelector } from '../reduxHooks';

interface ITodoDragCollectProps {
  isDragging: boolean
}

export default function useTodoListDrag(listId: TodoListId)
  : [ITodoDragCollectProps, ConnectDragSource] {
  const list = useAppSelector((state) => selectTodoListById(state, listId));

  const [collect, drag] = useDrag<ITodoList, any, ITodoDragCollectProps>(() => ({
    type: DndTypes.LIST,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
    item: list,
  }));

  return [collect, drag];
}
