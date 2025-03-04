import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

const configSlice = createSlice({
    name: 'lastMessage',
    initialState,
    reducers: {
        setLastMessage(state, action) {
            state.push(...action.payload)
        },
        updateLastMessage(state, action) {
            state.forEach(obj => {
                if (obj.lastMessage.roomId == action.payload.roomId) {
                    obj.lastMessage.roommessages.roomMessage = action.payload.message
                    obj.lastMessage.users.name = action.payload.name
                }
            })
        },
        addLastMessage(state,action){
            state.push(action.payload)
        }
    }

})

export const { setLastMessage, updateLastMessage, addLastMessage } = configSlice.actions;
export default configSlice.reducer