import { ConnectDropTarget, useDrop } from 'react-dnd';

import DndTypes from '../../DndTypes';
import { ITodo } from '../../models/ITodo';

interface ITodoDropCollectProps {
  isOver: boolean,
  draggedTodo: ITodo
}

export default function useTodoDrop()
  : [ITodoDropCollectProps, ConnectDropTarget] {
  const [collect, drop] = useDrop<ITodo, any, ITodoDropCollectProps>(
    () => ({
      accept: DndTypes.CARD,
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
        draggedTodo: monitor.getItem(),
      }),
    }),
  );

  return [collect, drop];
}
