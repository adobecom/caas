import {
    base1,
    base2,
    timedSort1,
    timedSort2,
} from '../TestingConstants/eventSort';
import { eventTiming, updateTimeOverride } from '../eventSort';

describe('utils/timeSorting', () => {
    describe('updateTimeOverride', () => {
        let originalHref;
        let originalReplaceState;

        beforeAll(() => {
            // Save the original URL and window.history.replaceState
            originalHref = window.location.href;
            originalReplaceState = window.history.replaceState;

            // Initialize URL
            window.location.href = 'http://example.com/path?servertime=1000';

            // Mock window.history.replaceState
            window.history.replaceState = jest.fn();
        });

        afterAll(() => {
            // Restore the original URL and window.history.replaceState
            window.location.href = originalHref;
            window.history.replaceState = originalReplaceState;
        });

        test('should update the URL with the new server time', () => {
            const base = 1000;
            const increment = 500;

            updateTimeOverride(base, increment);

            const expected = new URL(window.location.href);
            expected.searchParams.set('servertime', String(base + increment));
            expect(window.history.replaceState).toHaveBeenCalledWith(null, '', expected.toString());
        });

        test('should handle existing search parameters correctly', () => {
            window.location.href = 'http://example.com/path?param1=value1&servertime=1000';

            const base = 1000;
            const increment = 500;

            updateTimeOverride(base, increment);

            const expected = new URL(window.location.href);
            expected.searchParams.delete('servertime');
            expected.searchParams.append('servertime', String(base + increment));
            expect(window.history.replaceState).toHaveBeenCalledWith(null, '', expected.toString());
        });

        test('should handle no existing search parameters correctly', () => {
            window.location.href = 'http://example.com/path';

            const base = 1000;
            const increment = 500;

            updateTimeOverride(base, increment);

            const expected = new URL(window.location.href);
            expected.searchParams.set('servertime', String(base + increment));
            expect(window.history.replaceState).toHaveBeenCalledWith(null, '', expected.toString());
        });

        test('should handle multiple existing search parameters correctly', () => {
            window.location.href = 'http://example.com/path?param1=value1&param2=value2&servertime=1000';

            const base = 1000;
            const increment = 500;

            updateTimeOverride(base, increment);

            const expected = new URL(window.location.href);
            expected.searchParams.delete('servertime');
            expected.searchParams.append('servertime', String(base + increment));
            expect(window.history.replaceState).toHaveBeenCalledWith(null, '', expected.toString());
        });

        test('should handle no servertime parameter correctly', () => {
            window.location.href = 'http://example.com/path?param1=value1&param2=value2';

            const base = 1000;
            const increment = 500;

            updateTimeOverride(base, increment);

            const expected = new URL(window.location.href);
            expected.searchParams.append('servertime', String(base + increment));
            expect(window.history.replaceState).toHaveBeenCalledWith(null, '', expected.toString());
        });
    });

    describe('eventTiming', () => {
        test('should return empty array if no sessions are provided', () => {
            const result = eventTiming([]);
            expect(result).toEqual([]);
        });

        test('should categorize sessions correctly', () => {
            const sessions = [
                { startDate: '2023-10-01T10:00:00Z', endDate: '2023-10-01T11:00:00Z' }, // live
                { startDate: '2023-10-02T10:00:00Z', endDate: '2023-10-02T11:00:00Z' }, // upcoming
                { startDate: '2023-09-30T10:00:00Z', endDate: '2023-09-30T11:00:00Z' }, // on-demand
                { startDate: '', endDate: '' }, // not-timed
            ];

            const result = eventTiming(sessions);

            expect(result.visibleSessions.length).toBe(4);
            expect(result.visibleSessions[0].startDate).toBe('2023-09-30T10:00:00Z'); // on-demand
            expect(result.visibleSessions[1].startDate).toBe('2023-10-01T10:00:00Z'); // live
            expect(result.visibleSessions[2].startDate).toBe('2023-10-02T10:00:00Z'); // upcoming
            expect(result.visibleSessions[3].startDate).toBe(''); // not-timed
        });

        test('should handle sessions with tags correctly', () => {
            const sessions = [
                { startDate: '2023-10-01T10:00:00Z', endDate: '2023-10-01T11:00:00Z', tags: ['live-expired'] }, // live expired
                { startDate: '2023-10-02T10:00:00Z', endDate: '2023-10-02T11:00:00Z', tags: ['on-demand-scheduled'] }, // on-demand scheduled
            ];

            const result = eventTiming(sessions);

            expect(result.visibleSessions.length).toBe(2);
            expect(result.visibleSessions[0].startDate).toBe('2023-10-01T10:00:00Z'); // live expired
            expect(result.visibleSessions[1].startDate).toBe('2023-10-02T10:00:00Z'); // on-demand scheduled
        });

        /* eslint-disable */
        // test('should handle eventFilter correctly', () => {
        //     const sessions = [
        //         { startDate: '2023-10-01T10:00:00Z', endDate: '2023-10-01T11:00:00Z' }, // live
        //         { startDate: '2023-10-02T10:00:00Z', endDate: '2023-10-02T11:00:00Z' }, // upcoming
        //         { startDate: '2023-09-30T10:00:00Z', endDate: '2023-09-30T11:00:00Z' }, // on-demand
        //         { startDate: '', endDate: '' }, // not-timed
        //     ];

        //     const liveResult = eventTiming(sessions, 'live');
        //     expect(liveResult.visibleSessions.length).toBe(1);
        //     expect(liveResult.visibleSessions[0].startDate).toBe('2023-10-01T10:00:00Z'); // live

        //     const upcomingResult = eventTiming(sessions, 'upcoming');
        //     expect(upcomingResult.visibleSessions.length).toBe(1);
        //     expect(upcomingResult.visibleSessions[0].startDate).toBe('2023-10-02T10:00:00Z'); // upcoming

        //     const onDemandResult = eventTiming(sessions, 'on-demand');
        //     expect(onDemandResult.visibleSessions.length).toBe(1);
        //     expect(onDemandResult.visibleSessions[0].startDate).toBe('2023-09-30T10:00:00Z'); // on-demand
        //     const notTimedResult = eventTiming(sessions, 'not-timed');
        //     expect(notTimedResult.visibleSessions.length).toBe(1);
        //     expect(notTimedResult.visibleSessions[0].startDate).toBe(''); // not-timed
        // });
        /* eslint-enable */

        test('should handle edge cases correctly', () => {
            const sessions = [
                { startDate: 'invalid-date', endDate: 'invalid-date' }, // invalid dates
                { startDate: '2023-10-01T10:00:00Z', endDate: '' }, // missing end date
                { startDate: '', endDate: '2023-10-01T11:00:00Z' }, // missing start date
            ];

            const result = eventTiming(sessions);

            expect(result.visibleSessions.length).toBe(3);
            expect(result.visibleSessions[0].startDate).toBe('invalid-date'); // invalid dates
            expect(result.visibleSessions[1].startDate).toBe('2023-10-01T10:00:00Z'); // missing end date
            expect(result.visibleSessions[2].startDate).toBe(''); // missing start date
        });

        /* eslint-disable */
        // test('should set nextTransitionMs correctly', () => {
        //     const sessions = [
        //         { startDate: '2023-10-01T10:00:00Z', endDate: '2023-10-01T11:00:00Z' }, // live
        //         { startDate: '2023-10-02T10:00:00Z', endDate: '2023-10-02T11:00:00Z' }, // upcoming
        //     ];

        //     const result = eventTiming(sessions);

        //     expect(result.nextTransitionMs).toBeGreaterThan(0);
        // });
        /* eslint-enable */

        test('should handle overrideTime correctly', () => {
            const originalPerformanceNow = performance.now;
            performance.now = jest.fn(() => 1000);

            const sessions = [
                { startDate: '2023-10-01T10:00:00Z', endDate: '2023-10-01T11:00:00Z' }, // live
            ];

            const result = eventTiming(sessions);

            expect(result.visibleSessions.length).toBe(1);
            expect(result.visibleSessions[0].startDate).toBe('2023-10-01T10:00:00Z'); // live

            performance.now = originalPerformanceNow;
        });

        test('Event Sort Works', () => {
            const { visibleSessions } = eventTiming(base1);

            visibleSessions.forEach(({ id = '' }, i) => {
                expect(id.substring(0, 6)).toEqual(timedSort1[i].id.substring(0, 6));
            });
        });

        test('Live Swap Works', () => {
            const originalSetTimeout = global.setTimeout;
            global.setTimeout = jest.fn(fn => fn());

            function doAsync(time, sessions, cb) {
                setTimeout(() => {
                    const { visibleSessions: transitionSessions } =
                        eventTiming(sessions);

                    const items = transitionSessions.reduce((acc, item, i) => {
                        if (item.id === timedSort2[i].id) {
                            return [].concat(acc, [true]);
                        }

                        return [].concat(acc, [false]);
                    }, []);

                    cb(items);
                }, time);
            }

            const { nextTransitionMs, visibleSessions } = eventTiming(base2);
            const cb = jest.fn();

            doAsync(nextTransitionMs, visibleSessions, cb);

            expect(setTimeout).toHaveBeenCalled();
            expect(setTimeout).toHaveBeenCalledTimes(1);
            expect(setTimeout).toHaveBeenCalledWith(
                expect.any(Function),
                nextTransitionMs,
            );
            expect(cb).toHaveBeenCalled();
            expect(cb).toHaveBeenCalledTimes(1);

            // Restore the original setTimeout
            global.setTimeout = originalSetTimeout;
        });
    });
});
