import {createAction, createAsyncThunk} from "@reduxjs/toolkit";
import {api, headers} from "../../components/common/api";


export const getPhotos = createAsyncThunk(
    "Home/photos",
    async (payload, thunkAPI) => {
        try {
            let get
            let query
            let color
            if (payload.q || payload.color) {
                get = "/search/photos"
                query = !payload.q ? "color" : payload.q
                color = payload.color ? payload.color : null

            } else {
                get = `/photos`
            }
            const data = await api.get(get, {
                params: {
                    page: payload.page,
                    per_page: 30,
                    query,
                    color,
                },
                headers
            })
            let total = data.headers["x-total"]
            return payload.q || payload.color ? [data.data.results,total] : [data.data,total]
        } catch (error) {
            return thunkAPI.rejectWithValue(error)
        }
    }
)

export const getHomeCollection = createAsyncThunk(
    "Home/collections",
    async (payload, thunkAPI) => {
        try {
            const {data} = await api.get(`/collections`, {
                params: {
                    page: 15,
                    per_page: 4,
                },
                headers
            })
            return data
        } catch (error) {
            return thunkAPI.rejectWithValue(error)
        }
    }
)

export const getPhotoId = createAsyncThunk(
    "Home/modal-photo-id",
    async (payload, thunkAPI) => {
        try {
            const {data} = await api.get(`/photos/${payload.photo}`, {
                headers
            })
            return data
        } catch (error) {
            return thunkAPI.rejectWithValue(error)
        }
    }
)

export const getRelated = createAsyncThunk(
    "Home/modal-photo-related",
    async (payload, thunkAPI) => {
        try {
            const {data: {results}} = await api.get(`/photos/${payload.photo}/related`, {
                headers
            })
            return results
        } catch (error) {
            return thunkAPI.rejectWithValue(error)
        }
    }
)

export const setPhotos = createAction(
    "Home/photos",
)
export const setRelated = createAction(
    "Home/photo-related",
)
export const setPhotoId = createAction(
    "Home/photo-id",
)
export const setTotal = createAction(
    "Home/total",
)
export const setPhotoUrl = createAction(
    "Home/photo-url",
)



