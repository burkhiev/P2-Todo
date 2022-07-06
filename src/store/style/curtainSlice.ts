import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';

interface ICurtain {
  enable: boolean
}

const initialState: ICurtain = {
  enable: false,
};

const curtainSlice = createSlice({
  name: 'curtain',
  initialState,
  reducers: {
    curtainOn(state) {
      state.enable = true;
    },
    curtainOff(state) {
      state.enable = false;
    },
  },
});

export default curtainSlice.reducer;

export const {
  curtainOff,
  curtainOn,
} = curtainSlice.actions;

export const selectCurtainState = (state: RootState) => state.style.curtain.enable;
