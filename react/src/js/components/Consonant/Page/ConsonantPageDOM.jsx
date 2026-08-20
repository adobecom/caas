import { DOMModel, createRDC } from 'react-dom-components';
import Container from '../Container/Container';
import { parseDataConfig } from '../Helpers/decorators';

export class ConsonantPageModel extends DOMModel {
    constructor(element) {
        super(element);
        this.getAttribute('id', 'id');
        this.getAttribute('data-config', 'dataConfig');
    }
}

const consonantPageRDC = createRDC('consonant-card-collection', ConsonantPageModel, parseDataConfig(Container));
export default consonantPageRDC;
