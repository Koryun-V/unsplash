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
    const [isPosition, setIsPosition] = useState(false);
    const [isAnim, setIsAnim] = useState(false);
    const [headerWidth, setHeaderWidth] = useState("");
    const [unsplash, setUnsplash] = useState(true)
    const [opacity, setOpacity] = useState(1)
    const [isOpen, setIsOpen] = useState(false)

    useEffect(() => {
        if (unsplash && opacity === 1) {
            document.body.style.width = ` ${document.body.getBoundingClientRect().width}px`
            document.body.style.overflowY = 'hidden';
            document.body.ontouchmove = () => false;
        } else {
            const time = setTimeout(() => {
                document.body.style.removeProperty('overflow');
                document.body.style.removeProperty('width');
                document.body.ontouchmove = () => true;
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

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get("https://dummyjson.com/auth/me", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                });
                setUser(res.data);
            } catch (err) {
                console.error("Invalid token, logging out");
                localStorage.removeItem("token");
                setQuery({});
            }
        };

        if (token) {
            fetchUser();
        }
    }, []);

    useEffect(() => {
        window.addEventListener('resize', () => {
            setHeaderWidth(` ${document.body.getBoundingClientRect().width}px`);
        });
    }, []);

    useEffect(() => {
        window.addEventListener("scroll", () => {
            if (Math.floor(window.scrollY) >= 350) {
                setIsPosition(true);
                const time = setTimeout(() => {
                    setIsAnim(true)
                }, 300)
                return () => clearTimeout(time)
            } else {
                setIsPosition(false);
                const time = setTimeout(() => {
                    setIsAnim(false)
                }, 300)
                return () => clearTimeout(time)
            }
        })
    }, []);

    return (
        <>
            <div className="unsplash-block" style={{opacity: opacity, zIndex: unsplash ? 9999 : -1}}>
                <Unsplash className="unsplash"/>
            </div>

            <div className="wrapper">
                <header className="header">
                    <section className="section">
                        <div className="header-section"
                             style={{width: !headerWidth.length ? `${document.body.getBoundingClientRect().width}px` : headerWidth}}>

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
                                <>
                                    <Link to="/likes"
                                          className={window.location.pathname === "/likes" ? "active-like" : "likes"}>
                                        <div>
                                            <Like className="mark"/>
                                            <h2>Likes</h2>
                                        </div>
                                    </Link>

                                    <div className="container-user">

                                        {!isAnim ?
                                            <div className="block-user">
                                                <div className="header-user"
                                                     style={{width: "100%", opacity: !isPosition ? 1 : 0}}>
                                                    <hr style={{
                                                        width: "1px",
                                                        height: "5vh",
                                                        border: "1px solid #eee"
                                                    }}/>
                                                    <div className="first-name"><span>{user.firstName}</span></div>
                                                    <div className="user-image"><img src={user.image} alt="user-iamge"/>
                                                    </div>
                                                    <div className="logout" onClick={() => {
                                                        setQuery({q, color, photo, logOut: "no-yes"})
                                                        setIsOpen(true)

                                                    }}><span>Log Out</span></div>
                                                </div>
                                            </div>
                                            :
                                            <div className="block-user">
                                                <div className="header-user"
                                                     style={{ opacity: isPosition ? 1 : 0}}>
                                                    <hr style={{
                                                        width: "1px",
                                                        height: "5vh",
                                                        border: "1px solid #eee"
                                                    }}/>
                                                    <div className="first-name"><span>{user.firstName}</span></div>
                                                    <div className="user-image"><img src={user.image} alt="user-iamge"/>
                                                    </div>
                                                    <div className="logout" onClick={() => {
                                                        setQuery({q, color, photo, logOut: "no-yes"})
                                                        setIsOpen(true)

                                                    }}><span>Log Out</span></div>
                                                </div>
                                            </div>

                                        }
                                    </div>
                                </> : null}

                        </div>
                        <div className="header-text">
                            <p>Beautiful, free photos.</p>
                        </div>
                        <ModalLogOut
                            open={isOpen} onClose={() => {
                            setQuery({q, color, photo, logOut: ""})
                            setIsOpen(false)
                        }}/>
                    </section>
                </header>

                <main className="main">
                    <Outlet/>
                </main>

                <footer className="footer">
                    {!token ?
                        <div>
                            <hr></hr>
                            <p>Developed by Koryun Vardanyan — Unsplash 2025</p>
                        </div>
                        : null}
                </footer>
            </div>
        </>

    );
}

export default Layout;
