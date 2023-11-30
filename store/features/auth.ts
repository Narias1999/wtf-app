import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../api/auth';
import { RootState } from '../index';

interface AuthState {
  jwt: string | null;
  user: User | null;
};

const initialState: AuthState = {
  jwt: null,
  user: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (state, action: PayloadAction<AuthState>) => {
      state.jwt = action.payload.jwt;
      state.user = action.payload.user;
    },
    logout: (state) => {
      state.jwt = null;
      state.user = null;
    },
  },
});

export const selectUser = (state: RootState) => state.auth.user;

export const { setAuth, logout } = authSlice.actions;
