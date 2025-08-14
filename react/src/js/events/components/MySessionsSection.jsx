import React from 'react';
import { arrayOf, string, func, shape } from 'prop-types';

export default function MySessionsSection({ selectedIds, applyFilter, events }) {
    const filterId = events && events.mySessions && events.mySessions.filterId;
    const itemId = events && events.mySessions && events.mySessions.itemId;
    const active = !!(itemId && selectedIds && selectedIds.includes(itemId));
    const toggle = () => {
        if (filterId && itemId) {
            applyFilter(filterId, itemId, !active);
        }
    };
    return (
        <section
            className="events-my-sessions"
            data-testid="events-MySessionsSection">
            <div className="title">My Sessions</div>
            <button type="button" onClick={toggle} className="consonant-Btn">
                {active ? 'Showing My Sessions' : 'Show My Sessions'}
            </button>
        </section>
    );
}

MySessionsSection.propTypes = {
    selectedIds: arrayOf(string),
    applyFilter: func.isRequired,
    events: shape({
        mySessions: shape({
            filterId: string,
            itemId: string,
        }),
    }),
};

MySessionsSection.defaultProps = {
    selectedIds: [],
    events: {},
};
