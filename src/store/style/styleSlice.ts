import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

interface ICurtain {
  enable: boolean,
  currentImage: number
}

const initialState: ICurtain = {
  enable: false,
  currentImage: 0,
};

const styleSlice = createSlice({
  name: 'curtain',
  initialState,
  reducers: {
    curtainOn(state) {
      state.enable = true;
    },
    curtainOff(state) {
      state.enable = false;
    },
    selectImage(state, action: PayloadAction<number>) {
      const imgNumber = action.payload;
      state.currentImage = imgNumber;
    },
  },
});

export default styleSlice.reducer;

export const {
  curtainOff,
  curtainOn,
  selectImage,
} = styleSlice.actions;

export const selectCurtainState = (state: RootState) => state.style.enable;
export const selectCurrentImageStyle = (state: RootState) => state.style.currentImage;
