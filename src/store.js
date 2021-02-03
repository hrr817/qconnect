import { configureStore } from "@reduxjs/toolkit";
import modalSlice from "./features/modalSlice";
import userSlice from "./features/userSlice";

export default configureStore({
  reducer: {
    user: userSlice,
    modal: modalSlice,
  },
});
