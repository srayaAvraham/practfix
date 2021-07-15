import { configureStore } from '@reduxjs/toolkit';
import { userSlice } from '../features/user/userSlice';
import { videoSlice } from '../features/video/videoSlice';

export const store = configureStore({
  reducer: {
    user: userSlice.reducer,
    video: videoSlice.reducer
  },
});
