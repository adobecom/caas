import React, { memo, Fragment, useState, useEffect, useRef } from 'react';
import { string, bool } from 'prop-types';
import { createPortal } from 'react-dom';
import ModalWindow from './videoModal';
import Modal from './modal';

const VideoButton = ({
    name,
    videoURL,
    gateVideo,
    className,
    videoPolicy,
}) => {
    const modalContainer = document.querySelector('.modalContainer');

    const modalElement = useRef(null);
    const [isOpen, setIsOpen] = useState(false);
    const isAuthoredModal = /^#[a-zA-Z0-9_-]+/.test(videoURL);
    const isFullUrl = /https?:\/\/[a-zA-Z0-9_-]+/.test(videoURL);

    const handleShowModal = () => {
        if (isAuthoredModal) {
            window.location.hash = new URL(videoURL, document.baseURI).hash;
        } else if (isFullUrl && gateVideo) {
            window.open(videoURL, '_blank');
        } else {
            setIsOpen(true);
        }
    };

    const handleCloseModal = () => {
        setIsOpen(false);
    };

    const handleOverlayClose = () => {
        setIsOpen(false);
    };

    useEffect(() => {
        if (isOpen && modalElement && modalElement.current) {
            const videoModal = new Modal(
                modalElement.current,
                {
                    buttonClose: handleCloseModal,
                    overlayClose: handleOverlayClose,
                },
            );

            videoModal.open();
        }
    }, [isOpen, modalElement]);

    return (
        <Fragment>
            <button
                className="consonant-videoButton-wrapper"
                daa-ll="play"
                aria-label="Play"
                onClick={handleShowModal}>
                <div className={className} />
            </button>
            {isOpen && createPortal(
                <ModalWindow
                    name={name}
                    videoURL={videoURL}
                    innerRef={modalElement}
                    videoPolicy={videoPolicy} />,
                modalContainer,
            )}
        </Fragment>
    );
};

VideoButton.propTypes = {
    name: string,
    videoPolicy: string,
    videoURL: string.isRequired,
    gateVideo: bool,
    className: string.isRequired,
};

VideoButton.defaultProps = {
    name: 'video-modal',
    videoPolicy: 'autoplay; fullscreen',
    gateVideo: false,
};

export default memo(VideoButton);
