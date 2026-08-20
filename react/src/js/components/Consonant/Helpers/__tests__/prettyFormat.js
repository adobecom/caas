import PROPS from '../TestingConstants/prettyFormat';

import prettyFormat from '../prettyFormat';

describe('utils/prettyFormat', () => {
    PROPS.forEach(({
        startDateUTC, endDateUTC, locale, i18nFormat, expectedValue,
    }) => {
        test(`should return ${expectedValue} value`, () => {
            const value = prettyFormat(
                startDateUTC,
                endDateUTC,
                locale,
                i18nFormat,
            );

            expect(value).toContain('|');
        });
    });
});
