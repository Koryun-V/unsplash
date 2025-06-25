import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {getHomeCollection, getPhotos, setPhotos,} from "../../store/actions/home";
import Masonry, {ResponsiveMasonry} from "react-responsive-masonry";
import {ReactComponent as Mark} from "../../assets/icons/Check_mark.svg"
import Modal from "./Modal/Modal";
import {Link} from "react-router-dom";
import {setCollections} from "../../store/actions/collections";
import Mono from "../../assets/icons/Mark_black-white.png"

import usePagePlus from "../../hooks/usePagePlus";
import {useQuery} from "../../hooks/useQuery";
import {PulseLoader} from "react-spinners";
import Input from "./Input";

const colors = [
    "black_and_white",
    "black",
    "white",
    "yellow",
    "orange",
    "red",
    "purple",
    "magenta",
    "green"
]


const Home = () => {
    const dispatch = useDispatch()
    const {query, setQuery} = useQuery();
    const {q, color, photo} = query
    const photos = useSelector(state => state.home.photo)
    const collection = useSelector(state => state.home.collection)
    const status = useSelector(state => state.home.status)
    const total = useSelector(state => state.home.total)

    const [isLoading, setIsLoading] = useState(true)
    const {page, setPage, setIsScrollLocked} = usePagePlus()
    const [isOpen, setIsOpen] = useState(false)

    useEffect(() => {
        dispatch(getHomeCollection())
    }, []);

    useEffect(() => {
        if (!isLoading) {
            setIsScrollLocked(false);
        }
    }, [isLoading]);


    useEffect(() => {
        const timer = setTimeout(async () => {
            try {
                setIsLoading(true)
                await setPage(1)
                await dispatch(setPhotos([]))
                await dispatch(getPhotos({page: 1, q, color}))
                setIsLoading(false)
            } catch (err) {
                console.log(err)
            }
        }, q ? 500 : 0)
        return () => clearTimeout(timer)

    }, [q, color]);

    useEffect(() => {
        if (!isLoading && page !== 1 && total > photos.length) {
            (async () => {
                try {
                    setIsLoading(true)
                    await dispatch(getPhotos({page, q, color}))
                    setIsLoading(false)
                } catch (err) {
                    console.log(err)
                }
            })()
        }
    }, [page]);

    useEffect(() => {
        if (photo) setIsOpen(true)
        else setIsOpen(false)
    }, [photo]);

    const onChange = (e) => {
        if (e.target.value !== " ") setQuery({...query, q: e.target.value})
    }

    const changeColor = (color) => {
        if (query.color === color) setQuery({...query, color: ""})
        else setQuery({...query, color})
    }

    const getCurrentPhoto = (photo) => {
        setIsOpen(true)
        setQuery({...query, photo})
    }


    return (
        <section className="section-main">
            <header className="header-home">
                <Input value={q ? q : ''} onChange={onChange}/>
                <div className="color-block">
                    {colors.map((item, index) => (
                        <div key={index} onClick={() => changeColor(item)} className="color"
                             style={{background: item,}}>
                            {color === item && item !== "black_and_white" ?
                                <Mark className={item === "black" ? "mark" : null}/> : null}
                            {color === item && item === "black_and_white" ?
                                <img style={{width: "17px", height: "13px"}} src={Mono}/> : null}
                        </div>
                    ))}
                </div>
            </header>

            <aside className="aside-collections">
                <div className="collections-block">
                    <div className="nav">
                        <p>Collections</p>
                        <Link to="/collections" onClick={() => setCollections([])} className="link">See
                            all</Link>
                    </div>
                    <div className="titles">
                        {collection.length ? collection.map((item) => (
                            <Link key={item.id} to={`/collections/${item.id}`} className="titles-block">
                                <div className="img">
                                    <img src={item.cover_photo.urls.small} alt="collection"/>
                                </div>
                                <div className="text">
                                    <p>{item.title}</p>
                                    <p>by {item.user.name} {item.user.name === "Unsplash+" ? "Collections" : null}</p>
                                </div>
                            </Link>
                        )) : <p>Not found</p>}
                    </div>
                </div>
            </aside>

            <article className="article-photos" style={{marginTop: "80px"}}>
                {photos.length ?
                    <ResponsiveMasonry
                        columnsCountBreakPoints={{300: 1, 750: 2, 900: 3}}
                    >
                        <Masonry columnsCount={3} gutter="1.5rem">
                            {photos.map((item, index) => (
                                <div className="photo" key={item.id}
                                     onClick={() => getCurrentPhoto(item.id)}>
                                    <img src={item.urls.small} alt="photo"/>
                                    <div className={photo === item.id ? "active" : "current-photo"}>
                                        <div className="shadow-anim"></div>
                                        <div className="user-title">
                                            <img src={item.user.profile_image.large} alt="user-photo"/>
                                            <p>{item.user.name}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </Masonry>
                    </ResponsiveMasonry>
                    : null}
                {isLoading ? <div className="loading">
                    <PulseLoader
                        color="black"
                        loading={isLoading}
                        size={25}
                        aria-label="Loading Spinner"
                        data-testid="loader"
                    />
                </div> : null}
                {status === "ok" && !photos.length && !isLoading ?
                    <div className="no-results">
                        <h3>
                            No results
                        </h3>
                    </div> : null}
            </article>

            <Modal open={isOpen} onClose={() => {
                setIsOpen(false)
                setQuery({...query, photo: ""})
            }}/>
        </section>
    );
};

export default Home;
