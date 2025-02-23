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
            state[action.payload.key].push(action.payload.value)
        }
    }

})

export const { setChatsData, pushNewChat } = configSlice.actions;
export default configSlice.reducer