import { DOMModel, createRDC } from 'react-dom-components';
import Container from '../Container/Container';
import { parseDataConfig } from '../Helpers/decorators';

export class ConsonantPageModel extends DOMModel {
    constructor(element) {
        super(element);
        this.id = element.getAttribute('id'); // Initialize id
        this.dataConfig = element.getAttribute('data-config'); // Initialize dataConfig
    }

    getAttribute(attr) {
        return this[attr]; // Return the attribute value
    }
}

const consonantPageRDC = createRDC('consonant-card-collection', ConsonantPageModel, parseDataConfig(Container));
export default consonantPageRDC;
