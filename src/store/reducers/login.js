import {createReducer} from "@reduxjs/toolkit";
import {loginUser, setStatus,} from "../actions/login";

const initialState = {
    status: "",
    token: "",
}
export const login = createReducer(initialState, (builder) => {
    builder
        .addCase(loginUser.pending, (state) => {
            state.status = "pending"
        })
        .addCase(loginUser.fulfilled, (state, {payload}) => {
            state.status = "ok"
            state.token = payload
        })
        .addCase(loginUser.rejected, (state) => {
            state.status = "error"
        })

        .addCase(setStatus, (state, {payload}) => {
            state.status = payload
        })
});
