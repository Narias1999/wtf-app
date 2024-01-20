import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { Invitation } from '../../api/invitations';
import { RootState } from '../index';

interface InvitationsState {
  invitations: Invitation[];
};

const initialState: InvitationsState = {
  invitations: [],
};

export const invitationsSlice = createSlice({
  name: 'invitations',
  initialState,
  reducers: {
    setInvitations: (state, action: PayloadAction<InvitationsState>) => {
      state.invitations = action.payload.invitations;
    },
  },
});

export const selectInvitations = (state: RootState) => state.invitations.invitations;

export const { setInvitations } = invitationsSlice.actions;
