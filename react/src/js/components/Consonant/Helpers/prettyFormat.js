/**
 * Gets the Localized Local Time Zone
 * @param {Date} someTimeUTC - An authored time in UTC
 * @returns {Date} - Locale Time Zone in abbreviated named offset
 * @example - EST
 */
const getLocalTimeZone = (someTimeUTC, someLocale) => new Date(someTimeUTC)
    .toLocaleTimeString(someLocale, { timeZoneName: 'short' }).split(' ').slice(-1)[0];

/**
 * Gets the Local Time Interval
 * @param {Date} startDateUTC - An authored start date in UTC
 * @param {Date} endDateUTC - An authored end date in UTC
 * @param {String} locale - Locale to translate things to
 * @returns {Date} - Time Interval in localized 24-hour time
 * @example - 13:00 - 14:45
 */
const getTimeInterval = (startTimeUTC, endTimeUTC, someLocale) => {
    const options = { hour: '2-digit', minute: '2-digit' };

    const startTime = new Date(startTimeUTC).toLocaleTimeString(someLocale, options);
    const endTime = new Date(endTimeUTC).toLocaleTimeString(someLocale, options);

    return `${startTime} - ${endTime}`;
};

/**
 * Gets the localized day
 * @param {Date} someTimeUTC - An authored time in UTC
 * @returns {Date} - A day of the month, padded to 2
 * @example - 06
 */
const getDay = (someTimeUTC, someLocale) => new Date(someTimeUTC)
    .toLocaleDateString(someLocale, { day: '2-digit' });

/**
 * Gets the localized month
 * @param {Date} someTimeUTC - An authored time in UTC
 * @returns {Date} - Month as an abbreviated localized string
 * @example - Aug
 */
const getMonth = (someTimeUTC, someLocale) => new Date(someTimeUTC)
    .toLocaleDateString(someLocale, { month: 'short' });

/**
 * Gets the localized day of the week
 * @param {Date} someTimeUTC - An authored time in UTC
 * @returns {Date} - A day of the month, padded to 2
 * @example - Tue
 */
const getDayOfTheWeek = (someTimeUTC, someLocale) => new Date(someTimeUTC)
    .toLocaleDateString(someLocale, { weekday: 'short' });

/**
 * Gets Date Interval for Infobit in pretty format
 * @param {Date} startDateUTC - An authored start date in UTC
 * @param {Date} endDateUTC - An authored end date in UTC
 * @param {String} locale - Locale to translate things to
 * @param {String} i18nFormat - Format from AEM on how to render date
 * @returns {String} - Date interval in pretty format
 * @example - Oct 20 | 13:00 - 14:45 PDT
 */
const getPrettyDateInterval = (startDateUTC, endDateUTC, locale, i18nFormat) => i18nFormat
    .replace('{LLL}', getMonth(startDateUTC, locale))
    .replace('{dd}', getDay(startDateUTC, locale))
    .replace('{ddd}', getDayOfTheWeek(startDateUTC, locale))
    .replace('{timeRange}', getTimeInterval(startDateUTC, endDateUTC, locale))
    .replace('{timeZone}', getLocalTimeZone(startDateUTC, locale));

export default getPrettyDateInterval;
