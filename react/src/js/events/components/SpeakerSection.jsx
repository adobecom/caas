/* eslint-disable */
import React, { Fragment, useRef, useState, useEffect, memo } from 'react';
import { object } from 'prop-types';
import { createPortal } from 'react-dom';
import SpeakerModal from './SpeakerModal';

function SpeakerLink({ name, speaker }) {
    const modalContainer = document.querySelector('.modalContainer');
    const modalElement = useRef(null);
    const [open, setOpen] = useState(false);
    useEffect(() => {
        if (!open) return undefined;
        const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [open]);
    const jobTitle = speaker.globalJobtitle || speaker.jobTitle || '';
    const company = speaker.companyName || '';
    const bioHtml = speaker.description || '';
    const sessions = speaker.speakerSessions || [];
    const style = { background: 'none', border: 'none', padding: 0, color: '#1473e6', cursor: 'pointer' };
    return (
        <Fragment>
            <button type="button" onClick={() => setOpen(true)} style={style}>{name}</button>
            {open && modalContainer && createPortal(
                <div onClick={(e) => { if (e.target.classList && e.target.classList.contains('dexter-Modal_overlay')) setOpen(false); }}>
                    <SpeakerModal name={name} jobTitle={jobTitle} company={company} bioHtml={bioHtml} sessions={sessions} />
                </div>,
                modalContainer,
            )}
        </Fragment>
    );
}

const SpeakerSection = ({ card }) => {
    const speakers = (card && card.search && Array.isArray(card.search.speakers)) ? card.search.speakers : [];
    if (!speakers.length) return null;
    return (
        <div className="events-speakers" style={{ marginTop: '6px' }}>
            {speakers.map((sp, i) => (
                <span key={sp.speakerId || sp.globalFullName || i}>
                    <SpeakerLink name={sp.globalFullName || sp.name || 'Speaker'} speaker={sp} />
                    {i < speakers.length - 1 ? ', ' : ''}
                </span>
            ))}
        </div>
    );
};

SpeakerSection.propTypes = { card: object.isRequired }; // eslint-disable-line react/forbid-prop-types

export default memo(SpeakerSection);

