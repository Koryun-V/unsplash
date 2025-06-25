import {Link, Outlet} from "react-router-dom";
import {ReactComponent as Logo} from "../../assets/icons/Vector.svg"
import {useQuery} from "../../hooks/useQuery";
import React, {useEffect, useState} from "react";
import axios from "axios";
import {ReactComponent as Like} from "../../assets/icons/like.svg"
import {ReactComponent as Unsplash} from "../../assets/images/Unsplash.svg";
import ModalLogOut from "./Modal/ModalLogOut";

const token = localStorage.getItem("token");

function Layout() {
    const {query, setQuery} = useQuery();
    const {q, color, photo, logOut} = query
    const [user, setUser] = useState({});
    const [unsplash, setUnsplash] = useState(true)
    const [opacity, setOpacity] = useState(1)
    const [isOpen, setIsOpen] = useState(false)
    const [userLoaded, setUserLoaded] = useState(false);

    useEffect(() => {
        if (token) {
            (async () => {
                try {
                    const res = await axios.get("https://dummyjson.com/auth/me", {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    setUser(res.data);
                } catch (err) {
                    console.error("Invalid token, logging out");
                    localStorage.removeItem("token");
                    setUser({});
                } finally {
                    setUserLoaded(true);
                }
            })();
        } else {
            setUserLoaded(true);
        }
    }, [token]);

    useEffect(() => {
        if (userLoaded && !user.id) {
            localStorage.removeItem("token");
            setQuery({});
        }
    }, [userLoaded, user]);

    const scrollModal = () => {
        document.body.style.removeProperty('overflow');
        document.body.style.removeProperty('width');
        document.body.ontouchmove = () => true;
    }

    useEffect(() => {
        const header = document.querySelector('.header-nav');
        const headerText = document.querySelector('.header-text-c');
        const main = document.querySelector('.main');
        const footer = document.querySelector('.footer-c');
        if (unsplash && opacity === 1) {
            const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
            document.body.style.overflowY = 'hidden';
            document.body.ontouchmove = () => false;

            if (header) {
                header.style.paddingRight = `${scrollbarWidth}px`;
            }
            if (headerText) {
                headerText.style.paddingRight = `${scrollbarWidth}px`;
            }
            if (main) {
                main.style.paddingRight = `${scrollbarWidth}px`;
            }
            if (footer) {
                footer.style.paddingRight = `${scrollbarWidth}px`;
            }
        } else {
            const time = setTimeout(() => {
                scrollModal()
                if (header) {
                    header.style.paddingRight = '';
                }
                if (headerText) {
                    headerText.style.paddingRight = '';
                }
                if (main) {
                    main.style.paddingRight = '';
                }
                if (footer) {
                    footer.style.paddingRight = '';
                }
            }, 1000)
            return () => clearTimeout(time)
        }
    }, [unsplash]);

    useEffect(() => {
        if (opacity === 0) {
            setUnsplash(false)
        }
        const time = setTimeout(() => {
            setOpacity(0)

        }, 1000)
        return () => clearTimeout(time)
    }, [opacity]);


    return (
        <>
            <div className="unsplash-block" style={{opacity: opacity, zIndex: unsplash ? 9999 : -1}}>
                <Unsplash className="unsplash"/>
            </div>

            <div className="wrapper">
                <header className="header">
                    <section className="header-nav">

                        <div className="header-section">
                            <div className="header-block">
                                {window.location.pathname !== "/" ?
                                    <Link to={"/"} onClick={() => {
                                        setQuery({})
                                    }}
                                          className="header-link">
                                        <Logo className="logo" alt="logo"/>
                                        <h1>Unsplash</h1>
                                    </Link>
                                    :
                                    <div onClick={() => {
                                        window.scrollTo(0, 0)
                                    }}
                                         className="header-link">
                                        <Logo className="logo" alt="logo"/>
                                        <h1>Unsplash</h1>
                                    </div>
                                }
                                <hr style={{
                                    width: "1px",
                                    height: "5vh",
                                    border: "1px solid #eee",
                                    marginLeft: 10,
                                    marginTop: 5
                                }}/>

                                {token ?
                                    <Link to="/likes"
                                          className={window.location.pathname === "/likes" ? "active-like" : "likes"}>
                                        <div>
                                            <Like className="mark"/>
                                            <h2>Likes</h2>
                                        </div>
                                    </Link> : null}
                            </div>
                            {token ?
                                <div className="container-user">
                                    <div className="block-user">
                                        <div className="header-user">
                                            <div className="first-name"><span>{user.firstName}</span></div>
                                            <div className="user-image"><img src={user.image} alt="user-iamge"/>
                                            </div>
                                            <div className="logout" onClick={() => {
                                                setQuery({q, color, photo, logOut: "no-yes"})
                                                setIsOpen(true)

                                            }}><span>Log Out</span></div>
                                        </div>
                                    </div>
                                </div>
                                : null}
                        </div>

                        <ModalLogOut
                            open={isOpen} onClose={() => {
                            setQuery({q, color, photo, logOut: ""})
                            setIsOpen(false)
                        }}/>


                    </section>
                    <div className="header-text-c">
                        <div className="header-text">
                            <p>Beautiful, free photos.</p>
                        </div>
                    </div>
                </header>

                <main className="main">
                    <Outlet/>
                </main>

                <footer className="footer">
                    <div className="footer-c">
                        {!token ?
                            <div className="footer-block">
                                <hr></hr>
                                <p>Developed by Koryun Vardanyan — Unsplash 2025</p>
                            </div>
                            : null}
                    </div>
                </footer>
            </div>
        </>

    );
}

export default Layout;
