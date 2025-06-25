import {createReducer} from "@reduxjs/toolkit";
import {
    getCollectionPhotos,
    getCollections,
    getCollectionUser,
    setCollectionPhotos,
    setCollections, setCollectionUser,
} from "../actions/collections";
import _ from "lodash"


const initialState = {
    collections: [],
    collectionUser: [],
    collectionPhotos: [],
    username: "",
    status: "",
    total:"",
    totalCollectionPhotos:"",
}

export const collections = createReducer(initialState, (builder) => {
    builder
        .addCase(getCollections.pending, (state) => {
            state.status = "pending"
        })
        .addCase(getCollections.fulfilled, (state, {payload}) => {
            state.status = "ok"
            state.collections = _.uniqBy([...state.collections, ...payload[0]], "id")
            state.total = payload[1]
        })
        .addCase(getCollections.rejected, (state) => {
            state.status = "error"
        })
        //--------------------------------------------------------------------------------------------------------
        .addCase(getCollectionPhotos.pending, (state) => {
            state.status = "pending"
        })
        .addCase(getCollectionPhotos.fulfilled, (state, {payload}) => {
            state.status = "ok"
            state.collectionPhotos = _.uniqBy([...state.collectionPhotos, ...payload[0]],"id")
            state.totalCollectionPhotos = payload[1]
        })
        .addCase(getCollectionPhotos.rejected, (state) => {
            state.status = "error"
        })
        //--------------------------------------------------------------------------------------------------------
        .addCase(getCollectionUser.pending, (state) => {
            state.status = "pending"
        })
        .addCase(getCollectionUser.fulfilled, (state, {payload}) => {
            state.status = "ok"
            state.collectionUser = [payload]
        })
        .addCase(getCollectionUser.rejected, (state) => {
            state.status = "error"
        })
        //--------------------------------------------------------------------------------------------------------
        .addCase(setCollectionPhotos, (state, {payload}) => {
            state.collectionPhotos = payload
        })
        .addCase(setCollections, (state, {payload}) => {
            state.collections = payload
        })
        .addCase(setCollectionUser, (state, {payload}) => {
            state.collectionUser = payload
        })
})
