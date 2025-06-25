import React, {useCallback, useEffect, useState} from 'react';
import ReactDom from "react-dom";
import PropTypes from "prop-types";
import {useDispatch, useSelector} from "react-redux";
import Masonry, {ResponsiveMasonry} from "react-responsive-masonry";
import {getPhotoId, getRelated, setPhotoId, setPhotoUrl, setRelated} from "../../../store/actions/home";
import {ReactComponent as Download} from "../../../assets/icons/download.svg"
import {ReactComponent as Like} from "../../../assets/icons/like.svg"
import {Link} from "react-router-dom";
import {setCollections} from "../../../store/actions/collections";
import {useQuery} from "../../../hooks/useQuery";
import {ClipLoader} from "react-spinners";
import {saveAs} from 'file-saver'
import _ from "lodash";


function Modal({open, onClose}) {
    const dispatch = useDispatch()
    const {query, setQuery} = useQuery()
    const {color, q, photo} = query
    const photoId = useSelector(state => state.home.photoId)
    const related = useSelector(state => state.home.related)
    const [photosLiked, setPhotosLiked] = useState(JSON.parse(localStorage.getItem("like")) || []);
    const photoUrl = useSelector(state => state.home.photoUrl)

    const getCurrentRelated = (photo) => {
        setQuery({q, color, photo})
    }

    useEffect(() => {
        localStorage.setItem('like', JSON.stringify(photosLiked));
    }, [photosLiked]);

    useEffect(() => {
        if (photoId.length && open) {
            photosLiked.find((item) => {
                if (photoId[0].id === item.id) {
                    dispatch(setPhotoUrl(item.id))
                }
            })
        }
    }, [photoId, open]);

    const handleEsc = useCallback((event) => {
        if (event.keyCode === 27) {
            onClose();
        }
    }, []);

    const scrollModal = () => {
        document.body.style.removeProperty('overflow');
        document.body.style.removeProperty('width');
        document.body.ontouchmove = () => true;
        window.removeEventListener("keydown", handleEsc)
        dispatch(setRelated([]))
        dispatch(setPhotoId([]))
    }

    useEffect(() => {
        const header = document.querySelector('.header-nav');
        const headerText = document.querySelector('.header-text-c');
        const main = document.querySelector('.main');
        const footer = document.querySelector('.footer-c');
        if (open && photo) {
            (async () => {
                try {
                    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
                    document.body.style.overflowY = 'hidden';
                    document.body.ontouchmove = () => false;
                    window.addEventListener('keydown', handleEsc);
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
                    await dispatch(getPhotoId({photo}))
                    await dispatch(getRelated({photo}))
                    await dispatch(getRelated({photo}))

                } catch (err) {
                    console.log(err)
                }
            })()
        } else {
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
            scrollModal()
        }
    }, [open, photo]);

    const downloadImage = (image) => {
        const fileName = image.split("/").pop();
        saveAs(image, `${fileName}.jpg`);
    }

    const likeIt = (image) => {
        if (photoUrl === image.id) {
            dispatch(setPhotoUrl(""))
            const photosDisliked = photosLiked.filter((item) => item.id !== image.id);
            setPhotosLiked(_.unionBy(photosDisliked))
        } else {
            dispatch(setPhotoUrl(image.id))
            setPhotosLiked(_.unionBy([...photosLiked, image]))
        }
    }

    if (!open) return null
    return ReactDom.createPortal(
        <div id="modal">
            <div onClick={onClose} className="shadow">
            </div>
            <div id="modal_window">
                <div className="modal-block">
                    {photoId.length && related.length ?
                        <div className="scroll-block">
                            <div className="user">
                                <Link to={`/users/${photoId[0].user.username}/collections`} onClick={() => {
                                    dispatch(setRelated([]))
                                    dispatch(setPhotoId([]))
                                    dispatch(setCollections([]))
                                    scrollModal()
                                }} className="user-block">
                                    <div className="user-img">
                                        <img src={photoId[0].user.profile_image.large} alt="user-photo"/>
                                    </div>
                                    <div className="user-name">
                                        <p>{photoId[0].user.name}</p>
                                        {photoId[0].user.instagram_username ?
                                            <p>@{photoId[0].user.instagram_username}</p>
                                            : <p>There is no social page</p>
                                        }
                                    </div>
                                </Link>

                                <div className="user-details">
                                    <div>
                                        <Download className="download"
                                                  onClick={() => downloadImage(photoId[0].urls.full)}/>
                                        <Like className={photoId[0].id === photoUrl ? "active-like" : "like"}
                                              onClick={() => likeIt(photoId[0])}/>
                                    </div>

                                </div>
                            </div>

                            <div className="user-photo">
                                <img src={photoId[0].urls.small} alt="photo"/>
                            </div>

                            <div className="related-text">
                                <p>Related photos</p>
                            </div>
                            <div className="related">
                                <ResponsiveMasonry
                                    columnsCountBreakPoints={{300: 1, 750: 2, 900: 3}}
                                >
                                    <Masonry columnsCount={3} gutter="0,5rem">
                                        {related.map((item) => (
                                            <div className="related-photo" key={item.id} onClick={() => {
                                                getCurrentRelated(item.id)
                                                dispatch(setRelated([]))
                                                dispatch(setPhotoId([]))
                                            }}>
                                                <img src={item.urls.small} alt="related-photo"/>
                                            </div>
                                        ))}
                                    </Masonry>
                                </ResponsiveMasonry>
                            </div>
                        </div>
                        :
                        <ClipLoader
                            color="black"
                            size={150}
                            aria-label="Loading Spinner"
                            data-testid="loader"
                        />
                    }
                </div>
            </div>
        </div>,
        document.body
    );
}

Modal.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func,
    wrapperClassName: PropTypes.string,
    className: PropTypes.string,
    backdropBG: PropTypes.string,
    zIndex: PropTypes.number,
    overflowY: PropTypes.bool,
};

export default Modal;
