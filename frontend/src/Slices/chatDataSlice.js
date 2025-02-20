import { createSlice } from "@reduxjs/toolkit";

const initialState = {};

const configSlice = createSlice({
    name: 'chatData',
    initialState,
    reducers: {
        setChatData(state, action) {
            state[action.payload.key] = action.payload.value
        }
    }

})

export const { setChatData } = configSlice.actions;
export default configSlice.reducer