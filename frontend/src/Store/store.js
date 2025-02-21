import { configureStore } from "@reduxjs/toolkit";
import chatDataSlice from "../Slices/chatDataSlice";
import lastMessageSlice from "../Slices/lastMessageSlice"
export const store = configureStore({
    devTools:false,
    reducer: {
        chatData: chatDataSlice,
        lastMessage : lastMessageSlice
    }
})

