/* eslint-disable jsx-a11y/anchor-is-valid  */
import React from 'react';
import { string, oneOfType, shape, instanceOf } from 'prop-types';

const VideoModal = ({
    name,
    videoURL,
    innerRef,
    videoPolicy,
}) => (
    <div className="modal" id={`dexter-Modal_${Math.floor((Math.random() * 10e12))}`}>
        <div
            className="dexter-Modal_overlay mobile-place-center mobile-place-middle closePlacement-outsideTopRight is-Open tablet-inherit desktop-place-center desktop-inherit"
            data-conf-display="onPageLoad"
            data-page-name="dexter-modal-video"
            aria-modal="true"
            aria-label="Modal Video"
            role="dialog"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.9)' }}>
            <div ref={innerRef} className="dexter-Modal mobile-width-100 mobile-height-auto tablet-width-640 desktop-width-1024 is-Open" id={`video-${name}`}>
                <h6 id={`video-${name}-modalTitle`} className="hide-all">Video Modal</h6>
                <p id={`video-${name}-modalDescription`} className="hide-all">Video Modal</p>
                <div className="video aem-Grid aem-Grid--12 aem-Grid--default--12">
                    <div className="videoContainer" data-in-modal="true">
                        {/* eslint-disable jsx-a11y/no-noninteractive-tabindex */}
                        <iframe
                            title="Featured Video"
                            data-video-src={videoURL}
                            allow={videoPolicy}
                            frameBorder="0"
                            webkitallowfullscreen="true"
                            mozallowfullscreen="true"
                            allowFullScreen=""
                            src={videoURL}
                            tabIndex="0" />
                        {/* eslint-enable jsx-a11y/no-noninteractive-tabindex */}
                    </div>
                </div>
                <a href="#" className="dexter-CloseButton" aria-label="Close" role="button" tabIndex="0">
                    <i className="dexter-CloseButton_icon spectrum-close-circle-dark" />
                </a>
            </div>
        </div>
    </div>
);


VideoModal.propTypes = {
    name: string.isRequired,
    videoURL: string.isRequired,
    videoPolicy: string.isRequired,
    innerRef: oneOfType([
        shape({ current: instanceOf(Element) }),
    ]).isRequired,
};

export default VideoModal;
