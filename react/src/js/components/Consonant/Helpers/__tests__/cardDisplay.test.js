import cardDisplay from '../cardDisplay';

beforeEach(() => {
    document.body.innerHTML = '<section data-caas-collection><article data-testid="consonant-Card">Card</article></section>';
});
afterEach(() => { document.body.innerHTML = ''; });
const root = () => document.querySelector('section');
const card = () => document.querySelector('article');
const sized = () => { card().getBoundingClientRect = () => ({ width: 200, height: 100, top: 5000 }); };

test('off-screen cards count when they exist and have size', () => {
    sized();
    expect(cardDisplay(root())).toEqual({ domStatus: 'present', domCardCount: 1, displayedCardCount: 1 });
});
test.each(['display:none', 'visibility:hidden', 'visibility:collapse', 'opacity:0', 'content-visibility:hidden'])('hidden parent %s is not displayed', (style) => {
    sized(); root().setAttribute('style', style);
    expect(cardDisplay(root()).domStatus).toBe('hidden');
});
test('hidden attribute on ancestor is honored', () => {
    sized(); root().hidden = true;
    expect(cardDisplay(root()).displayedCardCount).toBe(0);
});
test('zero-size cards are not displayed', () => {
    expect(cardDisplay(root()).domStatus).toBe('hidden');
});
test('other and nested collections cannot produce a false success', () => {
    root().innerHTML = '<section data-caas-collection><article data-testid="consonant-Card">Other collection</article></section>';
    sized();
    expect(cardDisplay(root())).toEqual({ domStatus: 'missing', domCardCount: 0, displayedCardCount: 0 });
});
test('missing or detached roots are unknown', () => {
    expect(cardDisplay(null).domStatus).toBe('unknown');
    const element = root(); element.remove();
    expect(cardDisplay(element).domStatus).toBe('unknown');
});
