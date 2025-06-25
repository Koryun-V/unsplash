import {createAction, createAsyncThunk} from "@reduxjs/toolkit";
import axios from "axios";


export const loginUser = createAsyncThunk(
    "user/login",
    async (payload, thunkAPI) => {
        try {
            const {data} = await axios.post(`https://dummyjson.com/auth/login`, {
                    username: payload.username,
                    password: payload.password,
            })
            return data.accessToken
        } catch (error) {
            return thunkAPI.rejectWithValue(error)
        }
    }
);

export const setStatus = createAction(
    "login/status",
)


