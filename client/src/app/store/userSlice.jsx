import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    name: null,
    email: null,
    accessToken: null,
    refreshToken: null,
    _id: null
}
const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        login: (state, action) => {
            console.log(`Sto memorizzando lo USER su REDUX`, action.payload);
            state.email = action.payload.email;
            state.accessToken = action.payload.accessToken;
            state.refreshToken = action.payload.refreshToken,
            state.name = action.payload.displayName;
            state._id = action.payload._id;
        },
        logout: (state, action) => {
            console.log("pippo")
            state = initialState;
            return state;
        },
    }
})
export const { login, logout } = userSlice.actions;
export default userSlice.reducer 