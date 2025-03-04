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
            console.log(state);
        },
        renderChat(state, _action) {
            let dummy = state
            state = initialState
            state = dummy
        }
    }
})

export const { setChatsData, pushNewChat,renderChat } = configSlice.actions;
export default configSlice.reducer