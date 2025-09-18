/* eslint-disable */
import React from 'react';
import { string, arrayOf, shape } from 'prop-types';
import prettyFormatDate from '../../components/Consonant/Helpers/prettyFormat';
import { useConfig } from '../../components/Consonant/Helpers/hooks';

const SpeakerModal = ({ name, jobTitle, company, bioHtml, sessions }) => {
    const getConfig = useConfig();
    const i18nFormat = getConfig('collection', 'i18n.prettyDateIntervalFormat');
    const locale = getConfig('language', '');
    const fmt = (s, e) => (s ? prettyFormatDate(s, e, locale, i18nFormat) : '');

    return (
        <div className="modal" id={`dexter-Modal_${Math.floor((Math.random() * 10e12))}`}>
            <div
                className="dexter-Modal_overlay mobile-place-center mobile-place-middle closePlacement-outsideTopRight is-Open"
                data-conf-display="onPageLoad"
                data-page-name="dexter-modal-speaker"
                aria-modal="true"
                aria-label="Speaker Modal"
                role="dialog"
                style={{ backgroundColor: 'rgba(0, 0, 0, 0.9)' }}>
                <div className="dexter-Modal mobile-width-100 tablet-width-640 desktop-width-1024 is-Open">
                    <div style={{ padding: '16px 20px' }}>
                        <h3 style={{ margin: '0 0 4px' }}>{name}</h3>
                        {jobTitle && <div>{jobTitle}</div>}
                        {company && <div style={{ marginBottom: '12px' }}>{company}</div>}
                        {Array.isArray(sessions) && sessions.length > 0 && (
                            <div style={{ margin: '12px 0' }}>
                                {sessions.map(s => (
                                    <div key={`${s.sessionId || s.sessionCode || s.sessionTitle}`} style={{ marginBottom: '10px' }}>
                                        <div><strong>{s.sessionTitle}{s.sessionCode ? ` - ${s.sessionCode}` : ''}</strong></div>
                                        <div>{fmt(s.sessionStartTime, s.sessionEndTime)}</div>
                                        <div>Sign in to add to your favorites</div>
                                    </div>
                                ))}
                            </div>
                        )}
                        {bioHtml && (
                            <div
                                style={{ marginTop: '12px' }}
                                dangerouslySetInnerHTML={{ __html: bioHtml }}
                            />
                        )}
                    </div>
                    <a href="#" className="dexter-CloseButton" aria-label="Close" role="button" tabIndex="0">
                        <i className="dexter-CloseButton_icon spectrum-close-circle-dark" />
                    </a>
                </div>
            </div>
        </div>
    );
};

SpeakerModal.propTypes = {
    name: string.isRequired,
    jobTitle: string,
    company: string,
    bioHtml: string,
    sessions: arrayOf(shape({})),
};

SpeakerModal.defaultProps = {
    jobTitle: '',
    company: '',
    bioHtml: '',
    sessions: [],
};

export default SpeakerModal;

