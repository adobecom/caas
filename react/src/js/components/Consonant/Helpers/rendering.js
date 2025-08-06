import React from 'react';
import cuid from 'cuid';

/**
 * Handles highlighting search results on search
 * @param {String} text - Search Text
 * @param {String} value - Values to highlight
 * @returns {String []} - HTML with text highlighting
 */
export const HighlightSearchField = (text, value) => {
    const parts = text.split(new RegExp(`(${value})`, 'gi'));
    return parts.map(part => (
        part.toLowerCase() === value ?
            (
                <span
                    data-testid="consonant-SearchResult"
                    className="consonant-SearchResult"
                    key={cuid()}>
                    {part}
                </span>
            ) : part
    ));
};

/**
 * Handles generating HTML for errors
 * @param {String} text - Error Text
 * @param {String} value - Values to modify
 * @returns {String []} - HTML to render users on page error
 */
export const RenderDisplayMsg = (text, value) => {
    const arr = text.split(new RegExp('({query}|{break})', 'gi')).filter(item => item);
    return arr.map((item) => {
        switch (item.toLowerCase()) {
            case '{query}':
                return (
                    <strong
                        key={cuid()}>
                        {value}
                    </strong>
                );
            case '{break}':
                return (
                    <br
                        key={cuid()} />
                );
            default: return (
                <span
                    key={cuid()}>
                    {item}
                </span>
            );
        }
    });
};

/**
 * Handles generating HTML for total results text
 * @param {String} text - Text
 * @param {String} value - Values to modify
 * @returns {String []} - HTML to render total results text
 */
export const RenderTotalResults = (text, value) => {
    const arr = text.split(new RegExp('({total})', 'gi')).filter(item => item);
    return arr.map(item => (item.toLowerCase() === '{total}' ? <strong key={cuid()}>{value}</strong> : <span key={cuid()}>{item}</span>));
};
