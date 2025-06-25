import React, {useEffect, useState} from 'react';
import Masonry, {ResponsiveMasonry} from "react-responsive-masonry";
import {PulseLoader} from "react-spinners";
import Modal from "./Modal/Modal";
import {useQuery} from "../../hooks/useQuery";
import {ReactComponent as Like} from "../../assets/icons/like.svg"

const Likes = () => {
    const photosLiked = JSON.parse(localStorage.getItem('like')) || [];
    const {query, setQuery} = useQuery();
    const {q, color, photo} = query
    const [isOpen, setIsOpen] = useState(false)
    // const like = useSelector(state=>state.home.photoUrl)
    const [isLoading, setIsLoading] = useState(true)
    const [isResult, setIsResult] = useState(true)

    useEffect(() => {
        if (photosLiked.length) {
            setIsLoading(false)
        } else {
            setIsLoading(false)
            setIsResult(false)
        }
    }, [photosLiked.length]);

    useEffect(() => {
        if (!photo) {
            setIsOpen(false)
        } else {
            setIsOpen(true)
        }
    }, [photo]);

    const getCurrentPhoto = (photo) => {
        setIsOpen(true)
        setQuery({...query, photo})
    }

    return (
        <section className="section-main">
            <div className="section">
                <header className="header-likes">
                    <div className="likes">
                        <Like className="mark"/>
                        <h2>Likes</h2>
                    </div>
                </header>

                <article className="article-photos" style={{marginTop: "25px"}}>
                    {photosLiked.length ?
                        <ResponsiveMasonry
                            columnsCountBreakPoints={{300: 1, 750: 2, 900: 3}}
                        >
                            <Masonry columnsCount={3} gutter="1.5rem">
                                {photosLiked.map((item, index) => (
                                    <div className="photo" key={index} onClick={() => getCurrentPhoto(item.id)}>
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
                    {!photosLiked.length ? <div className="loading">
                        <PulseLoader
                            color="black"
                            loading={isLoading}
                            size={25}
                            aria-label="Loading Spinner"
                            data-testid="loader"
                        />
                    </div> : null}
                    {!photosLiked.length && !isLoading && !isResult ?
                        <div className="no-results">
                            <h3>
                                No likes
                            </h3>
                        </div> : null}
                </article>

                <Modal open={isOpen} onClose={() => {
                    setIsOpen(false)
                    setQuery({...query, photo: ""})
                }}/>
            </div>
        </section>
    );
};

export default Likes;
