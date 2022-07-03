import { ConnectDropTarget, useDrop } from 'react-dnd';

import DndTypes from '../../service/DndTypes';
import { IOnDropReturnType } from '../../components/body/table/Table';
import { ITodoList } from '../../models/ITodoList';
import { moveList } from '../../store/todo/listSlice';
import { useAppDispatch } from '../reduxHooks';

interface IUseTodoListDropCollectProps {
  listIsOver: boolean,
  draggedList: ITodoList
}

export default function useTodoListDrop(
  onDrop: () => (IOnDropReturnType | undefined),
  deps?: any[],
): [IUseTodoListDropCollectProps, ConnectDropTarget] {
  const dispatch = useAppDispatch();

  const [collect, drop] = useDrop<ITodoList, any, IUseTodoListDropCollectProps>(
    () => ({
      accept: DndTypes.LIST,
      drop: ({ listId }) => {
        const dropInfo = onDrop();

        if (!dropInfo) {
          return;
        }

        dispatch(moveList({
          draggedListId: listId,
          targetListId: dropInfo.listId,
          dropSide: dropInfo.dropSide,
        }));
      },
      collect: (monitor) => ({
        listIsOver: !!monitor.isOver(),
        draggedList: monitor.getItem(),
      }),
    }),
    (deps ? [...deps] : []),
  );

  return [collect, drop];
}
