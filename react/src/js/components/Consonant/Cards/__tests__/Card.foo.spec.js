import React from 'react';
import { shallow } from 'enzyme';
import Card from '../Card';
import { INFOBIT_TYPE } from '../../Helpers/constants';

describe('Consonant/Cards/Card', () => {
    it('renders without crashing with minimal props', () => {
        const wrapper = shallow(
            <Card id="test-id" onClick={() => {}} bannerMap={{}} />
        );
        expect(wrapper.exists()).toBe(true);
    });

    it('renders LinkBlocker when renderOverlay prop is true', () => {
        const wrapper = shallow(
            <Card
                id="id2"
                onClick={() => {}}
                bannerMap={{}}
                renderOverlay
                overlayLink="test-url"
            />
        );
        const blocker = wrapper.find('LinkBlocker');
        expect(blocker).toHaveLength(1);
        expect(blocker.prop('link')).toBe('test-url');
    });

    it('renders LinkBlocker when hideCTA prop is true', () => {
        const wrapper = shallow(
            <Card id="id3" onClick={() => {}} bannerMap={{}} hideCTA overlayLink="hide-url" />
        );
        expect(wrapper.find('LinkBlocker').exists()).toBe(true);
    });
});
