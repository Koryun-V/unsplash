import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {getCollections, setCollections,} from "../../store/actions/collections";
import {Link, useParams} from "react-router-dom";
import usePagePlus from "../../hooks/usePagePlus";
import Masonry, {ResponsiveMasonry} from "react-responsive-masonry";
import {PulseLoader} from "react-spinners";
import {setTotal} from "../../store/actions/home";


const Collections = () => {
    const dispatch = useDispatch();
    const collections = useSelector(state => state.collections.collections);
    const {username} = useParams()
    const status = useSelector(state => state.collections.status)
    const total = useSelector(state => state.collections.total)

    const [isLoading, setIsLoading] = useState(true)
    const {page, setPage, setIsScrollLocked} = usePagePlus()

    useEffect(() => {
        dispatch(setCollections([]))
        setPage(1)
    }, []);

    useEffect(() => {
        if (!isLoading) {
            setIsScrollLocked(false);
        }
    }, [isLoading]);

    useEffect(() => {
        getCollection(1)
    }, []);

    useEffect(() => {
        if (!isLoading && page !== 1 && total > collections.length) {
            getCollection(page)
        }
    }, [page]);

    const getCollection = async (page) => {
        try {
            setIsLoading(true)
            await dispatch(getCollections({username, page}));
            setIsLoading(false)
        } catch (err) {
            console.log(err)
        }
    }


    return (
        <section className="section-main">
            <div className="section">

                <header className="collections-header">
                    <div>
                        <h1>Collections</h1>
                        <p>Explore the world
                            through collections of beautiful HD pictures</p>
                    </div>

                    <div className="collection-user">
                        {username && collections[0] ?
                            <img src={collections[0].user.profile_image.large} alt="user-photo"/> : null}
                    </div>
                </header>

                <article className="article-collections">
                    <div className="container">
                        {collections.length ?
                            <ResponsiveMasonry
                                columnsCountBreakPoints={{300: 1, 900: 2, 1200: 3}}
                            >
                                <Masonry columnsCount={3} gutter="1.5rem">
                                    {collections.map((item) => (
                                        <Link
                                            key={item.id}
                                            to={username === "undefined" ? `/users/${item.user.username}/collections/${item.id}` : `/collections/${item.id}`}
                                            className="collection"
                                            onClick={() => dispatch(setTotal(item.total_photos))}
                                        >
                                            <div className="collection-album" key={item.id}>
                                                {Array.from({length: 3}).map((_, index) => {
                                                    const photo = item.preview_photos?.[index];
                                                    return (
                                                        <div className="photo-block" key={index}>
                                                            {photo ? (
                                                                <img src={photo.urls.small} alt="photo"/>
                                                            ) : null}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                            <div className="title">
                                                <p>{item.title}</p>
                                                <p>{item.total_photos}-photos - Curated by {item.user.name}</p>
                                            </div>
                                            <div className="collections-hover">
                                            </div>
                                            <div className="collections-hover-text">
                                                <h3>{item.title}</h3>
                                                <p>{item.total_photos}-photos - Curated by {item.user.name}</p>
                                            </div>
                                        </Link>))}
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
                    </div>
                    {status === "ok" && !collections.length && !isLoading ?
                        <div className="no-results">
                            <h3>
                                No results
                            </h3>
                        </div> : null}
                </article>
            </div>
        </section>
    );
};

export default Collections;
