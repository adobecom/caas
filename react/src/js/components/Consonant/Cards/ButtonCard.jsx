import React from 'react';
import { useCardData } from './CardContext';
import LinkBlocker from './LinkBlocker/LinkBlocker';

const ButtonCard = () => {
    const {
        id,
        country,
        reference,
        lh,
        cardClassName,
        title,
        linkBlockerTarget,
        overlay,
        cta2Text,
        ariaHidden,
    } = useCardData();

    return (
        <li
            daa-lh={lh}
            className={`button-card ${cardClassName}`}
            data-testid="consonant-Card"
            id={id}
            {...(country && { 'data-country': country })}
            {...(reference && { 'data-card-url': reference })}>
            <div className="consonant-Card-content">
                <a href={overlay} className="consonant-ButtonCard-link">{cta2Text}</a>
            </div>
            <LinkBlocker
                target={linkBlockerTarget}
                link={overlay}
                title={title}
                getsFocus
                ariaHidden={ariaHidden}
                tabIndex={ariaHidden ? -1 : 0}
                daa={cta2Text} />
        </li>
    );
};

export default ButtonCard;
