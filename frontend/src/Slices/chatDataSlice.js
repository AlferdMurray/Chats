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
            if(state[action.payload.key]){
                state[action.payload.key].push(action.payload.value)                
            }
        },
        // addChatData(state,action){
        //     state[action.payload.key] = action.payload.value
        // }
    }

})

export const { setChatData,pushNewMessage,addChatData } = configSlice.actions;
export default configSlice.reducer