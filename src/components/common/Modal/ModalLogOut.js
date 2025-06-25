import React, {useCallback, useEffect} from 'react';
import ReactDom from "react-dom";
import PropTypes from "prop-types";
import {useQuery} from "../../../hooks/useQuery";


function ModalLogOut({open, onClose}) {
    const {query, setQuery} = useQuery();
    const {q, color, photo, logOut} = query

    useEffect(() => {
        if (!logOut) {
            onClose()
            setQuery({q, color, photo, logOut})
        }
    }, [logOut]);

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
    }

    useEffect(() => {
        const header = document.querySelector('.header-nav');
        const headerText = document.querySelector('.header-text-c');
        const main = document.querySelector('.main');
        const footer = document.querySelector('.footer-c');
        if (open && query) {
            (async () => {
                try {
                    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
                    // document.body.style.width = `${document.body.getBoundingClientRect().width}px`;
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
    }, [open, logOut]);

    if (!open) return null
    return ReactDom.createPortal(
        <div id="modal-log-out">
            <div className="shadow-log-out">
            </div>
            ,div
            <div id="modal_window-log-out">
                <div className="modal-block-log-out">
                    <div className="position-block">
                        <div className="triangle-circle">
                            <div className="triangle"></div>
                            <span>!</span>
                        </div>
                        <div className="attention-log-out">
                            <h3>Attention!</h3>
                            <p>Are you sure you want to log out?</p>
                        </div>
                        <div className="log-out">
                            <button className="no" onClick={() => onClose()}>
                                NO
                            </button>
                            <hr/>
                            <button className="yes" onClick={() => {
                                localStorage.removeItem("token");
                                window.location.reload(true);
                            }}>
                                <div className="anim">
                                </div>
                                YES
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}

ModalLogOut.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func,
    wrapperClassName: PropTypes.string,
    className: PropTypes.string,
    backdropBG: PropTypes.string,
    zIndex: PropTypes.number,
    overflowY: PropTypes.bool,
};

export default ModalLogOut;
