import React from 'react';
import {Navigate, Route, Routes} from "react-router-dom";
import Layout from "./components/common/Layout";
import Home from "./components/common/Home";
import Collections from "./components/common/Collections";
import Collection from "./components/common/Collection";
import Login from "./components/common/Login";
import NotFound from "./components/common/NotFound";
import Likes from "./components/common/Likes";

const token = localStorage.getItem("token");

function App() {
    return (
        <Routes>
            <Route path="/" element={<Layout/>}>
                <Route index element={!token ? <Login/> : <Home/>}/>
                <Route path="/likes" element={!token ? <Login/> : <Likes/>}/>
                <Route path="/collections" element={!token ? <Login/> : <Collections/>}/>
                <Route path="/collections/:id" element={!token ? <Login/> : <Collection/>}/>
                <Route path="/users/:username/collections" element={!token ? <Login/> : <Collections/>}/>
                <Route path="/users/:username/collections/:id" element={!token ? <Login/> : <Collection/>}/>

                <Route path="404" element={<NotFound/>}/>
                <Route path="*" element={<Navigate to="/404" replace/>}/>
            </Route>
        </Routes>
    );
}

export default App;
