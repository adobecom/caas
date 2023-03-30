/* eslint-disable */
import "./polyfills";
import React from 'react';
import ReactDOM, { render } from 'react-dom';
import { DOMRegistry } from 'react-dom-components';
import { parseToPrimitive } from './components/Consonant/Helpers/general';
import Container from './components/Consonant/Container/Container';
import consonantPageRDC from './components/Consonant/Page/ConsonantPageDOM';

const domRegistry = new DOMRegistry(React, render);
domRegistry.register({
    consonantPageRDC,
});

alert('hi');

const initReact = (element) => {
    domRegistry.init(element);
};

initReact(document);

function collectionLoadedThroughXf(el) {
    const container = el.firstElementChild;
    let consonantCardCollection = null;
    if (container !== null) {
        consonantCardCollection = container.querySelectorAll('.consonantcardcollection');
    }
    return el.className.indexOf('experiencefragment')
        && consonantCardCollection
        && consonantCardCollection.length > 0;
}

let prev = null;
function authorWatch(el) {
    if (prev !== el && collectionLoadedThroughXf(el)) {
        prev = el;
        domRegistry.render(consonantPageRDC);
    }
}

// Add to DXF Registry
try {
    window.dexter.dxf.registerApp(initReact);
} catch (e) {
    /* eslint-disable no-empty */
}

export class ConsonantCardCollecton {
    constructor(config, element) {
        ReactDOM.render((
            <React.Fragment>
                <Container config={parseToPrimitive(config)} />
            </React.Fragment>), element);
    }
}

window.ConsonantCardCollection = ConsonantCardCollecton;

if (window.Granite && window.dx) {
    window.dx.author.watch.registerFunction(authorWatch);
}
export default initReact;
