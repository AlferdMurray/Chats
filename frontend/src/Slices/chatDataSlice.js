import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

const configSlice = createSlice({
    name: 'chatData',
    initialState,
    reducers: {
        setChatData(_state, action) {
            return (action.payload)
        }
    }

})

export const { setChatData } = configSlice.actions;
export default configSlice.reducer