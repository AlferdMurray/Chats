import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

const configSlice = createSlice({
    name: 'chatsData',
    initialState,
    reducers: {
        setChatsData(state, action) {
            state.push(...action.payload)
        },
        pushNewChat(state, action) {
            state.push(action.payload)
        }
    }

})

export const { setChatsData, pushNewChat } = configSlice.actions;
export default configSlice.reducer