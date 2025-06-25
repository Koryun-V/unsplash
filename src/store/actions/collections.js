import {createAction, createAsyncThunk} from "@reduxjs/toolkit";
import {api, headers} from "../../components/common/api";


export const getCollections = createAsyncThunk(
    "Collections/collections",
    async (payload, thunkAPI) => {
        try {
            let get
            if (payload.username) {
                get = `/users/${payload.username}/collections`
            } else {
                get = "/collections"
            }
            const data = await api.get(get, {
                params: {
                    page: payload.page,
                    per_page: 30,
                },
                headers
            })
            let total = data.headers["x-total"]
            return [data.data, total]
        } catch (error) {
            return thunkAPI.rejectWithValue(error)
        }
    }
)

export const getCollectionPhotos = createAsyncThunk(
    "Collections/collection-query",
    async (payload, thunkAPI) => {
        try {
            let get
            let query
            if (payload.q) {
                get = "/search/photos"
                query = payload.q
            } else {
                get = `/collections/${payload.id}/photos`
            }
            const data = await api.get(get, {
                params: {
                    page: payload.page,
                    per_page: 30,
                    query,
                    collections: payload.id
                },
                headers
            })
            let totalCollectionPhotos = data.headers["x-total"]
            return payload.q ? [data.data.results, totalCollectionPhotos] : [data.data,totalCollectionPhotos]
        } catch (error) {
            return thunkAPI.rejectWithValue(error)
        }
    }
)

export const getCollectionUser = createAsyncThunk(
    "collections/collection",
    async (payload, thunkAPI) => {
        try {
            const {data} = await api.get(`/collections/${payload.id}`, {
                headers
            })
            return data
        } catch (error) {
            return thunkAPI.rejectWithValue(error)
        }
    }
)

export const setCollections = createAction(
    "collections",
)
export const setCollectionUser = createAction(
    "collections/collection-user",
)
export const setCollectionPhotos = createAction(
    "collections/collection-photos",
)


