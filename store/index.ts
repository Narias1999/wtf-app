import { configureStore } from '@reduxjs/toolkit';
import { setupListeners} from '@reduxjs/toolkit/query/react';
import { authApi } from '../api/auth';

const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(authApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
setupListeners(store.dispatch);

export default store;