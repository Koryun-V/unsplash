import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {loginUser, setStatus} from "../../store/actions/login";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEye, faEyeSlash} from "@fortawesome/free-solid-svg-icons";
import {BarLoader} from "react-spinners";

import HomeWeb from "../../assets/images/Home_Web.jpg"
import HomeApp from "../../assets/images/Home_App.jpg"

const fields = [
    {
        id: 1,
        name: "username",
        label: "username",
    },
    {
        id: 2,
        name: "password",
        label: "Password",
    }
]

const Login = () => {
    const dispatch = useDispatch();
    const status = useSelector(state => state.login.status)
    const token = useSelector(state => state.login.token)

    const [eye, setEye] = useState(faEyeSlash)
    const [state, setState] = useState("disabled")
    const [isImage, setIsImage] = useState(false);
    const [user, setUser] = useState({
        username: "",
        password: "",
    })
    const {username, password} = user

    useEffect(() => {
        if (token) {
            localStorage.setItem("token", token)
            window.location.reload(true);
        }
    }, [token]);

    useEffect(() => {
        resize()
        window.addEventListener('resize', () => {
            resize()
        });
    }, []);

    const resize = () => {
        if (window.innerWidth < 1100) {
            setIsImage(false)
        } else {
            setIsImage(true)
        }
    }

    useEffect(() => {
        if (user.username.length > 1 && user.password.length > 3) {
            setState("active")
        } else {
            setState("disabled")
        }
    }, [user]);

    const login = (e) => {
        e.preventDefault();
        dispatch(loginUser({username, password}))
    }

    const onChange = (event) => {
        setUser((prevState) => (
            {...prevState, [event.target.name]: event.target.value}
        ))
        if (status === "error") dispatch(setStatus(""))
    }


    return (
        <section className="section-main">
            <div className="section" style={{
                marginBottom:0,
            }}>
                <div className="container-login">
                    <article className="article-web">
                        {isImage ? <img src={HomeWeb} alt="Home-Web" className="photo-web"/> : null}
                    </article>

                    <form onSubmit={login}>
                        <h2>Welcome!</h2>
                        <div className="login-password">
                            <div className="l-block">
                                <span>Login:</span>
                                <span>Password:</span>
                            </div>
                            <div className="l-block">
                                <span>emilys</span>
                                <span>emilyspass</span>
                            </div>

                        </div>
                        {fields.map((field) => (
                            <div key={field.id}>
                                <input
                                    {...field}
                                    onChange={onChange}
                                    value={user[field.name]}
                                    placeholder={field.name}
                                    type={field.name === "password" && eye === faEyeSlash ? "password" : "text"}
                                    id={field.name === "password" ? "input" : ""}
                                />
                                {field.name === "password"
                                    // && user[field.name].length
                                    ?
                                    <FontAwesomeIcon onClick={() =>
                                        setEye(eye === faEye
                                            ? faEyeSlash : faEye)

                                    } icon={eye}
                                        // style={{color: focus ? "#0098FF" : "black"}}
                                                     className="eye"/> : null}
                            </div>
                        ))}
                        <div className="reject">
                            {status === "pending" ?
                                <BarLoader
                                    loading={true}
                                    color="#0098FF"
                                    size={15}
                                    aria-label="Loading Spinner"
                                    data-testid="loader"
                                    speedMultiplier={2}
                                /> : null}
                            {status === "error" ? <span>Wrong login or password.</span> : null}
                        </div>
                        <button className={state} type={state === "active" ? "submit" : "button"}>Login</button>
                    </form>

                    <article className="article-app">
                        {isImage ? <img src={HomeApp} alt="Home-App" className="photo-app"/> : null}
                    </article>
                </div>
            </div>
        </section>
    );
};

export default Login;
