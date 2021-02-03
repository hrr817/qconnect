import { createSlice } from "@reduxjs/toolkit";

export const modalSlice = createSlice({
  name: "modal",
  initialState: false,
  reducers: {
    setModal: (state, action) => action.payload,
  },
});

export const { setModal } = modalSlice.actions;

export const selectModal = ({ modal }) => modal;

export default modalSlice.reducer;
