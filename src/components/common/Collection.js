import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {
    getCollectionPhotos, getCollectionUser, setCollectionPhotos, setCollectionUser,
} from "../../store/actions/collections";
import {useParams} from "react-router-dom";
import Masonry, {ResponsiveMasonry} from "react-responsive-masonry";
import Modal from "./Modal/Modal";
import usePagePlus from "../../hooks/usePagePlus";
import {useQuery} from "../../hooks/useQuery";
import {PulseLoader} from "react-spinners";
import Input from "./Input";

const Collection = () => {
    const dispatch = useDispatch();
    const {id} = useParams()
    const {query, setQuery} = useQuery();
    const {q, photo} = query

    const collection = useSelector(state => state.collections.collectionUser)
    const collectionPhotos = useSelector(state => state.collections.collectionPhotos)
    const status = useSelector(state => state.collections.status)
    const total = useSelector(state => state.collections.totalCollectionPhotos)

    const [isLoading, setIsLoading] = useState(true)
    const {page, setPage, setIsScrollLocked} = usePagePlus()
    const [isOpen, setIsOpen] = useState(false)

    useEffect(() => {
        dispatch(setCollectionUser([]))
        dispatch(setCollectionPhotos([]))
        dispatch(getCollectionUser({id}))
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
                await dispatch(setCollectionPhotos([]))
                await dispatch(getCollectionPhotos({id, q, page: 1}))
                setIsLoading(false)
            } catch (err) {
                console.log(err)
            }
        }, 500)
        return () => clearTimeout(timer)
    }, [q]);

    useEffect(() => {
        if (!isLoading && page !== 1 && total > collectionPhotos.length) {
            (async () => {
                try {
                    setIsLoading(true)
                    await dispatch(getCollectionPhotos({id, q, page}))
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

    const getCurrentPhoto = (photo) => {
        setIsOpen(true)
        setQuery({...query, photo})
    }


    return (
        <section className="section-main">
            <div className="section">
                <header className="header-collection">
                    <div className="collection-title">
                        {collection.length ?
                            <>
                                <div>
                                    <p>{collection[0].title}</p>
                                    <p>{collection[0].total_photos} photos - Curated by {collection[0].user.name}</p>
                                </div>
                                <img src={collection[0].user.profile_image.large} alt="user-photo"/>
                            </>
                            : null}
                    </div>
                    <Input value={q ? q : ""} onChange={onChange}/>
                </header>

                <article className="article-photos" style={{marginTop: "50px"}}>
                    {collectionPhotos.length ?
                        <ResponsiveMasonry
                            columnsCountBreakPoints={{300: 1, 750: 2, 900: 3}}
                        >
                            <Masonry columnsCount={3} gutter="1.5rem">
                                {collectionPhotos.map((item, index) => (
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
                        </ResponsiveMasonry> : null}

                    {isLoading ? <div className="loading">
                        <PulseLoader
                            color="black"
                            loading={isLoading}
                            size={25}
                            aria-label="Loading Spinner"
                            data-testid="loader"
                        />
                    </div> : null}
                    {status === "ok" && !collectionPhotos.length && !isLoading ?
                        <div className="no-results">
                            <h3>
                                No results
                            </h3>
                        </div> : null}
                </article>

                <Modal open={isOpen} onClose={() => {
                    setIsOpen(false)
                    setQuery({q})
                }} isOpen/>
            </div>
        </section>
    );
};

export default Collection;
