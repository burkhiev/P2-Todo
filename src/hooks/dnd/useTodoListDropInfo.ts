import { ConnectDropTarget, useDrop } from 'react-dnd';

import DndTypes from '../../DndTypes';
import { ITodoList } from '../../models/ITodoList';

interface ITodoListDropCollectProps {
  listIsOver: boolean,
  draggedList: ITodoList
}

export default function useTodoListDropInfo()
  : [ITodoListDropCollectProps, ConnectDropTarget] {
  const [collect, drop] = useDrop<ITodoList, any, ITodoListDropCollectProps>(
    () => ({
      accept: DndTypes.LIST,
      collect: (monitor) => ({
        listIsOver: !!monitor.isOver(),
        draggedList: monitor.getItem(),
      }),
    }),
  );

  return [collect, drop];
}
