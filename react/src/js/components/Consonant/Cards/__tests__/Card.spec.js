import React from 'react';
import { screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { shallow } from 'enzyme';
import * as hooks from '../../Helpers/hooks';
import { INFOBIT_TYPE } from '../../Helpers/constants';
import Card from '../Card';
import setup from '../../Testing/Utils/Settings';
import prettyFormatDate from '../../Helpers/prettyFormat';

// --- Testing-Library edge cases ---
const renderCard = setup(Card, {});

describe('Card Component - Testing-Library edge cases', () => {
    test('banner for gated half-height card when not registered', () => {
        const {
            props: {
                bannerMap: {
                    register: { description, backgroundColor, fontColor },
                },
            },
        } = renderCard({
            cardStyle: 'half-height',
            tags: [{ id: '/caas:gated' }],
            isRegistered: false,
            bannerMap: {
                register: {
                    description: 'Register Now',
                    backgroundColor: '#000',
                    fontColor: '#fff',
                },
            },
        });

        const banner = screen.getByTestId('consonant-Card-banner');
        expect(banner).toHaveStyle({ color: fontColor, backgroundColor });
        expect(banner).toHaveTextContent(description);
    });

    test('aria-label combines banner & title when banners on', () => {
        const bannerDescription = 'Register Now';
        const title = 'My Title';
        renderCard({
            cardStyle: 'half-height',
            tags: [{ id: '/caas:gated' }],
            isRegistered: false,
            bannerMap: { register: { description: bannerDescription, backgroundColor: '#000', fontColor: '#fff' } },
            contentArea: { title },
            hasBanner: true,
            disableBanners: false,
        });
        const card = screen.getByTestId('consonant-Card');
        expect(card).toHaveAttribute('aria-label', `${bannerDescription} | ${title}`);
    });

    test('future-date detailText for half-height card', () => {
        const today = new Date();
        const nextYear = new Date(today.setFullYear(today.getFullYear() + 1))
            .toISOString()
            .split('T')[0];

        renderCard({
            cardStyle: 'half-height',
            startDate: nextYear,
            endDate: '2023-01-03',
            bannerMap: { event: { description: 'Event', backgroundColor: '#000', fontColor: '#fff', icon: '' } },
        });

        const label = screen.getByTestId('consonant-Card-label');
        const expected = prettyFormatDate(nextYear, '2023-01-03', 'en-US', '{LLL} {dd} | {timeRange} {timeZone}');
        expect(label).toHaveTextContent(expected);
    });
});

// ===== Enzyme tests (smoke + LinkBlocker + detailTextOption) =====
describe('Card enzyme tests', () => {
    let configSpy, regSpy;

    beforeAll(() => {
        // spy on hooks so Card’s useConfig/useRegistered don’t blow up
        configSpy = jest.spyOn(hooks, 'useConfig').mockReturnValue(() => '');
        regSpy    = jest.spyOn(hooks, 'useRegistered').mockReturnValue(false);
    });

    afterAll(() => {
        configSpy.mockRestore();
        regSpy.mockRestore();
    });

    it('mounts (smoke) with minimal props', () => {
        const wrapper = shallow(<Card id="smoke" onClick={()=>{}} bannerMap={{}} />);
        expect(wrapper.exists()).toBe(true);
    });

    it('renders LinkBlocker for renderOverlay', () => {
        const w = shallow(<Card id="o" onClick={()=>{}} bannerMap={{}} renderOverlay overlayLink="u" />);
        const lb = w.find('LinkBlocker');
        expect(lb).toHaveLength(1);
        expect(lb.prop('link')).toBe('u');
    });

    it('renders LinkBlocker for hideCTA', () => {
        const w = shallow(<Card id="h" onClick={()=>{}} bannerMap={{}} hideCTA overlayLink="u2" />);
        expect(w.find('LinkBlocker').exists()).toBe(true);
    });

    // detailTextOption = modifiedDate
    it('detailTextOption: modifiedDate', () => {
        const iso = '2020-01-02T00:00:00Z';
        hooks.useConfig.mockReturnValue((cat, key) => {
            if (key === 'detailsTextOption') return 'modifiedDate';
            if (key === 'i18n.lastModified')   return 'Last modified {date}';
            return '';
        });
        const w = shallow(<Card id="m" onClick={()=>{}} bannerMap={{}} modifiedDate={iso} />);
        const txt = w.find('[data-testid="consonant-Card-label"]').text();
        expect(txt).toBe(`Last modified ${new Date(iso).toLocaleDateString()}`);
    });

    // detailTextOption = createdDate
    it('detailTextOption: createdDate', () => {
        const iso = '2021-03-15T00:00:00Z';
        hooks.useConfig.mockReturnValue((c,k) => k==='detailsTextOption'?'createdDate':'');
        const w = shallow(<Card id="c" onClick={()=>{}} bannerMap={{}} cardDate={iso} />);
        expect(w.find('[data-testid="consonant-Card-label"]').text())
            .toBe(new Date(iso).toLocaleDateString());
    });

    // detailTextOption = staticDate
    it('detailTextOption: staticDate', () => {
        const isoZ = '2021-04-01Z';
        hooks.useConfig.mockReturnValue((c,k) => k==='detailsTextOption'?'staticDate':'');
        const w = shallow(<Card id="s" onClick={()=>{}} bannerMap={{}} cardDate={isoZ} />);
        const expected = new Date(isoZ.replace(/Z$/, '')).toLocaleDateString();
        expect(w.find('[data-testid="consonant-Card-label"]').text()).toBe(expected);
    });
});
