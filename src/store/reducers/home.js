import {createReducer} from "@reduxjs/toolkit";
import {
    getPhotoId, getRelated, setPhotoId, setRelated,
    getHomeCollection, setPhotos, getPhotos, setTotal, setPhotoUrl,
} from "../actions/home";
import _ from "lodash";


const initialState = {
    photo: [],
    related: [],
    photoId: {},
    collection: {},
    color: "",
    status: "",
    total:0,
    endPage:"",
    photoLike:[],
    photoUrl:"",
}

export const home = createReducer(initialState, (builder) => {
    builder
        .addCase(getPhotos.pending, (state) => {
            state.status = "pending"
        })
        .addCase(getPhotos.fulfilled, (state, {payload}) => {
            state.status = "ok"
            state.photo = _.uniqBy([...state.photo, ...payload[0]], "id")
            state.total = payload[1]
        })
        .addCase(getPhotos.rejected, (state) => {
            state.status = "error"
        })
        //-----------------------------------------------------------------------------------
        .addCase(getHomeCollection.pending, (state) => {
            state.status = "pending"
        })
        .addCase(getHomeCollection.fulfilled, (state, {payload}) => {
            state.status = "ok"
            state.collection = payload
        })
        .addCase(getHomeCollection.rejected, (state) => {
            state.status = "error"
        })
        //-----------------------------------------------------------------------------------
        .addCase(getPhotoId.pending, (state) => {
            state.status = "pending"
        })
        .addCase(getPhotoId.fulfilled, (state, {payload}) => {
            state.status = "ok"
            state.photoId = [payload]
        })
        .addCase(getPhotoId.rejected, (state) => {
            state.status = "error"
        })
        //-----------------------------------------------------------------------------------
        .addCase(getRelated.pending, (state) => {
            state.status = "pending"
        })
        .addCase(getRelated.fulfilled, (state, {payload}) => {
            state.status = "ok"
            state.related = payload
        })
        .addCase(getRelated.rejected, (state) => {
            state.status = "error"
        })
        //-----------------------------------------------------------------------------------
        .addCase(setPhotos, (state, {payload}) => {
            state.photo = payload
        })
        .addCase(setRelated, (state, {payload}) => {
            state.related = payload
        })
        .addCase(setPhotoId, (state, {payload}) => {
            state.photoId = payload
        })
        .addCase(setTotal, (state, {payload}) => {
            state.total = payload
        })
        .addCase(setPhotoUrl, (state, {payload}) => {
            state.photoUrl = payload
        })
})
