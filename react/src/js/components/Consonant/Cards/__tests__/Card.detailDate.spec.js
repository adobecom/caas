import React from 'react';
import { shallow } from 'enzyme';
import Card from '../Card';
import * as hooks from '../../Helpers/hooks';

// Mock out useConfig() and useRegistered() so we can drive the detailText branches:
jest.mock('../../Helpers/hooks', () => {
    const original = jest.requireActual('../../Helpers/hooks');
    return {
        ...original,
        useConfig: jest.fn(),
        useRegistered: jest.fn(),
    };
});

describe('Card detailText branches', () => {
    beforeEach(() => {
        hooks.useRegistered.mockReturnValue(false);
    });

    it('renders a “Last modified {date}” when detailsTextOption is modifiedDate', () => {
        const iso = '2020-01-02T00:00:00Z';
        // our fake getConfig() will tell Card to use modifiedDate + template:
        hooks.useConfig.mockReturnValue((cat, key) => {
            if (key === 'detailsTextOption') return 'modifiedDate';
            if (key === 'i18n.lastModified')   return 'Last modified {date}';
            return '';
        });

        const wrapper = shallow(
            <Card id="1" onClick={()=>{}} bannerMap={{}} modifiedDate={iso} />
        );

        const label = wrapper.find('[data-testid="consonant-Card-label"]').text();
        const local = new Date(iso).toLocaleDateString();
        expect(label).toBe(`Last modified ${local}`);
    });

    it('renders the created date when detailsTextOption is createdDate', () => {
        const iso = '2021-03-15T00:00:00Z';
        hooks.useConfig.mockReturnValue((cat, key) =>
            key === 'detailsTextOption' ? 'createdDate' : ''
        );

        const wrapper = shallow(
            <Card id="2" onClick={()=>{}} bannerMap={{}} cardDate={iso} />
        );
        const label = wrapper.find('[data-testid="consonant-Card-label"]').text();
        expect(label).toBe(new Date(iso).toLocaleDateString());
    });

    it('renders a static date when detailsTextOption is staticDate', () => {
        const isoZ = '2021-04-01Z';
        hooks.useConfig.mockReturnValue((cat, key) =>
            key === 'detailsTextOption' ? 'staticDate' : ''
        );
        const wrapper = shallow(
            <Card id="3" onClick={()=>{}} bannerMap={{}} cardDate={isoZ} />
        );
        const label = wrapper.find('[data-testid="consonant-Card-label"]').text();
        const expected = new Date(isoZ.replace(/Z$/, '')).toLocaleDateString();
        expect(label).toBe(expected);
    });
});
