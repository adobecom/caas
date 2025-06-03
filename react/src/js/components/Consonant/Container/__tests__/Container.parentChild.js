import { getParentChild } from '../Container';

describe('getParentChild', () => {
    it('splits id with a single slash', () => {
        expect(getParentChild('parent/child')).toEqual(['parent', 'child']);
    });

    it('handles multiple slashes by splitting at the last slash', () => {
        expect(getParentChild('a/b/c')).toEqual(['a/b', 'c']);
    });

    it('returns empty parent if no slash found', () => {
        expect(getParentChild('foobar')).toEqual(['', 'foobar']);
    });

    it('handles leading slash', () => {
        expect(getParentChild('/bar')).toEqual(['', 'bar']);
    });

    it('handles trailing slash', () => {
        expect(getParentChild('foo/')).toEqual(['foo', '']);
    });
});
