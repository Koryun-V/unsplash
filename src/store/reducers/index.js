import {combineReducers} from "redux";
import {home} from "./home";
import {login} from "./login";
import {collections} from "./collections";

export const rootReducer = combineReducers({
    home,
    collections,
    login,
})
