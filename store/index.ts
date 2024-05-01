import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { setupListeners} from '@reduxjs/toolkit/query/react';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../api';
import { authSlice } from './features/auth';

AsyncStorage.clear();

const authPersistConfig = {
  key: 'auth',
  storage: AsyncStorage,
}

const rootReducer = combineReducers({
  [api.reducerPath]: api.reducer,
  auth: persistReducer(authPersistConfig, authSlice.reducer),
});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(
    {
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }
  ).concat(api.middleware),
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
setupListeners(store.dispatch);

export default store;
export const persistor = persistStore(store);