import { configureStore } from '@reduxjs/toolkit';
import classroomReducer from '@/features/classroom/state/classroomSlice';

export const store = configureStore({
  reducer: {
    classroom: classroomReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
