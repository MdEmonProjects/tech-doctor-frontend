import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type ModalType = 'ADD_REPAIR_DEVICE' | 'ADD_REPAIR_BRAND' | null;

interface ModalState {
  isOpen: boolean;
  title: string;
  modalType: ModalType;
}

const initialState: ModalState = { isOpen: false, title: '', modalType: null };

const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    openModal: (state, action: PayloadAction<{ title: string; modalType: Exclude<ModalType, null> }>) => {
      state.isOpen = true;
      state.title = action.payload.title;
      state.modalType = action.payload.modalType;
    },
    closeModal: () => initialState,
  },
});

export const { openModal, closeModal } = modalSlice.actions;
export default modalSlice.reducer;
