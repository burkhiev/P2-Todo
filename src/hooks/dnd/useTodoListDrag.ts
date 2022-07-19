import { ConnectDragSource, useDrag } from 'react-dnd';

import DndTypes from '../../service/DndTypes';
import { ITodoList, TodoListId } from '../../models/ITodoList';
import { useAppSelector } from '../reduxHooks';
import { selectListById } from '../../store/api/listSlice';

interface ITodoDragCollectProps {
  isDragging: boolean
}

export default function useTodoListDrag(listId: TodoListId)
  : [ITodoDragCollectProps, ConnectDragSource] {
  const list = useAppSelector((state) => selectListById(state, listId));

  const [collect, drag] = useDrag<ITodoList, any, ITodoDragCollectProps>(() => ({
    type: DndTypes.LIST,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
    item: list,
  }));

  return [collect, drag];
}
