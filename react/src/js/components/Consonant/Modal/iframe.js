export default class Iframe {
    constructor(element) {
        this.element = element;
    }

    setSrc() {
        this.element.src = this.element.dataset.src;
    }

    removeSrc() {
        this.element.onload = undefined;
        // Get parent element
        const parent = this.element.parentElement;
        // Temporarily store current element
        const tempElement = this.element;
        // Remove current element to prevent history change
        parent.removeChild(this.element);
        // Reset the source of the temp element
        tempElement.src = '';
        // Reset this.element
        this.element = tempElement;
        // Add it back to the DOM
        parent.appendChild(this.element);
    }
}
