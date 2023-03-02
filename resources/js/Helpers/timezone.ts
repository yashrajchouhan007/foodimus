/**
 * Gets the current browser timezone
 * @returns the browser timezone
 */
const getTimezone = () => Intl.DateTimeFormat().resolvedOptions().timeZone;

export default getTimezone;
