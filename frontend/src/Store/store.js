import { configureStore } from "@reduxjs/toolkit";
import chatDataSlice from "../Slices/chatDataSlice";
export const store = configureStore({
    devTools:false,
    reducer: {
        section: chatDataSlice
    }
})

