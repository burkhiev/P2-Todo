import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface IDragSliceState {
  isTodoCardDragging: boolean,
  isTodoListDragging: boolean
}

const initialState: IDragSliceState = {
  isTodoCardDragging: false,
  isTodoListDragging: false,
};

const dragDropSlice = createSlice({
  name: 'drag',
  initialState,
  reducers: {
    setTodoCardDragging(state, action: PayloadAction<boolean>) {
      state.isTodoCardDragging = action.payload;
    },
    setTodoListDragging(state, action: PayloadAction<boolean>) {
      state.isTodoListDragging = action.payload;
    },
  },
});

export default dragDropSlice.reducer;

export const {
  setTodoCardDragging,
  setTodoListDragging,
} = dragDropSlice.actions;
