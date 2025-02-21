import { createSlice } from "@reduxjs/toolkit";

const initialState = {};

const configSlice = createSlice({
    name: 'chatData',
    initialState,
    reducers: {
        setChatData(state, action) {
            state[action.payload.key] = action.payload.value
        },
        pushNewMessage(state,action){
            state[action.payload.key].push(action.payload.value)
        }
    }

})

export const { setChatData,pushNewMessage } = configSlice.actions;
export default configSlice.reducer