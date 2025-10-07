import React, { memo, Fragment, useState, useEffect, useRef } from 'react';
import { string, bool, number } from 'prop-types';
import { createPortal } from 'react-dom';
import ModalWindow from './videoModal';
import Modal from './modal';
import { useConfig } from '../Helpers/hooks';

const VideoButton = ({
    title,
    name,
    videoURL,
    gateVideo,
    className,
    videoPolicy,
    tabIndex,
}) => {
    const getConfig = useConfig();
    const modalContainer = document.querySelector('.modalContainer');
    const playVideo = getConfig('collection', 'i18n.playVideo');

    const modalElement = useRef(null);
    const [isOpen, setIsOpen] = useState(false);
    const isAuthoredModal = /^#[a-zA-Z0-9_-]+/.test(videoURL);
    const isFullUrl = /https?:\/\/[a-zA-Z0-9_-]+/.test(videoURL);
    const ariaLabel = playVideo.replace('{cardTitle}', title);

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
            <div
                className="consonant-Card-videoButton-wrapper"
                data-testid="consonant-Card-videoButton-wrapper">
                <button
                    daa-ll="play"
                    aria-label={ariaLabel}
                    onClick={handleShowModal}
                    tabIndex={tabIndex}
                    className={className}>
                    {className.includes('modal-video-cta') && <span>{name}</span>}
                </button>
            </div>
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
    title: string,
    name: string,
    videoPolicy: string,
    videoURL: string.isRequired,
    gateVideo: bool,
    className: string.isRequired,
    tabIndex: number,
};

VideoButton.defaultProps = {
    title: '',
    name: 'video-modal',
    videoPolicy: 'autoplay; fullscreen',
    gateVideo: false,
    tabIndex: 0,
};

export default memo(VideoButton);
