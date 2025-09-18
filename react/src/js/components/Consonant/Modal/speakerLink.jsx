import React, { memo, Fragment, useRef, useState, useEffect } from 'react';
import { string, object } from 'prop-types';
import { createPortal } from 'react-dom';
import Modal from './modal';
import SpeakerModal from './speakerModal';

const SpeakerLink = ({
    name,
    speaker,
}) => {
    const modalContainer = document.querySelector('.modalContainer');
    const modalElement = useRef(null);
    const [isOpen, setIsOpen] = useState(false);

    const handleOpen = (e) => {
        e.preventDefault();
        setIsOpen(true);
    };
    const handleClose = () => setIsOpen(false);

    useEffect(() => {
        if (isOpen && modalElement && modalElement.current) {
            const m = new Modal(modalElement.current, {
                buttonClose: handleClose,
                overlayClose: handleClose,
            });
            m.open();
        }
    }, [isOpen, modalElement]);

    const jobTitle = speaker.globalJobtitle || speaker.jobTitle || '';
    const company = speaker.companyName || '';
    const bioHtml = speaker.description || '';
    const sessions = speaker.speakerSessions || [];

    const linkStyle = {
        background: 'none',
        border: 'none',
        padding: 0,
        color: '#1473e6',
        cursor: 'pointer',
    };

    return (
        <Fragment>
            <button
                type="button"
                onClick={handleOpen}
                className="consonant-Card-speakerLink"
                style={linkStyle}
            >
                {name}
            </button>
            {isOpen && modalContainer && createPortal(
                <div ref={modalElement}>
                    <SpeakerModal
                        name={name}
                        jobTitle={jobTitle}
                        company={company}
                        bioHtml={bioHtml}
                        sessions={sessions}
                    />
                </div>,
                modalContainer,
            )}
        </Fragment>
    );
};

SpeakerLink.propTypes = {
    name: string.isRequired,
    speaker: object.isRequired, // eslint-disable-line react/forbid-prop-types
};

export default memo(SpeakerLink);
