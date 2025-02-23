import { configureStore } from "@reduxjs/toolkit";
import chatDataSlice from "../Slices/chatDataSlice";
import lastMessageSlice from "../Slices/lastMessageSlice"
import chatsDataSlice from "../Slices/chatsDataSlice"
export const store = configureStore({
    devTools:false,
    reducer: {
        chatData: chatDataSlice,
        lastMessage : lastMessageSlice,
        chatsData : chatsDataSlice
    }
})

