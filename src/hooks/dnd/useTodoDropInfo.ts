import { ConnectDropTarget, useDrop } from 'react-dnd';

import DndTypes from '../../service/DndTypes';
import { ITodo } from '../../models/ITodo';

interface ITodoDropCollectProps {
  todoIsOver: boolean,
  draggedTodo: ITodo
}

export default function useTodoDropInfo()
  : [ITodoDropCollectProps, ConnectDropTarget] {
  const [collect, drop] = useDrop<ITodo, any, ITodoDropCollectProps>(
    () => ({
      accept: DndTypes.CARD,
      collect: (monitor) => ({
        todoIsOver: !!monitor.isOver(),
        draggedTodo: monitor.getItem(),
      }),
    }),
  );

  return [collect, drop];
}
