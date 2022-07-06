import { ConnectDropTarget, useDrop } from 'react-dnd';

import DndTypes from '../../service/DndTypes';
import { ITodo } from '../../models/ITodo';
import { TodoListId } from '../../models/ITodoList';
import { moveTodo } from '../../store/todo/todoSlice';
import { useAppDispatch } from '../reduxHooks';

interface ITodoDropCollectProps {
  isOver: boolean,
  draggedTodo: ITodo
}

export default function useTodoDrop(
  newListId: TodoListId,
  insertIndex: number,
  onDrop: () => void,
)
  : [ITodoDropCollectProps, ConnectDropTarget] {
  const dispatch = useAppDispatch();

  const [collect, drop] = useDrop<ITodo, any, ITodoDropCollectProps>(
    () => ({
      accept: DndTypes.CARD,
      drop: ({ id: todoId }) => {
        dispatch(moveTodo({
          todoId,
          newListId,
          insertIndex,
        }));

        onDrop();
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
        draggedTodo: monitor.getItem(),
      }),
    }),
  );

  return [collect, drop];
}
