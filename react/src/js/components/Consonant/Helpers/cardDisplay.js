// Structural/style evidence only: no viewport, image, occlusion or attention claim.
export default function cardDisplay(root) {
    if (!root || !root.isConnected) return { domStatus: 'unknown', domCardCount: 0, displayedCardCount: 0 };
    const cards = Array.from(root.querySelectorAll('[data-testid="consonant-Card"]'))
        .filter(card => card.closest('[data-caas-collection]') === root);
    const displayed = cards.filter((card) => {
        const rect = card.getBoundingClientRect();
        if (rect.width <= 0 || rect.height <= 0) return false;
        for (let node = card; node; node = node.parentElement) {
            const style = globalThis.getComputedStyle(node);
            if (node.hidden || style.display === 'none' || style.visibility === 'hidden'
                || style.visibility === 'collapse' || style.opacity === '0'
                || style.contentVisibility === 'hidden') return false;
        }
        return true;
    });
    let domStatus = cards.length ? 'hidden' : 'missing';
    if (displayed.length) domStatus = 'present';
    return { domStatus,
        domCardCount: cards.length,
        displayedCardCount: displayed.length };
}
