const MS_PER_DAY = 1000 * 60 * 60 * 24;
const ellipses = '\u2026'; // code \u2026 it's ellipses
const separator = ' - ';

const currentCultureSettings = {
    firstDay: 0,
};

const getCurrentDate = (): Date => {
    return new Date();
};

const toDayStart = (date: Date, isUTC = false): Date => {
    if (isUTC) {
        date.setUTCMilliseconds(0);
        date.setUTCSeconds(0);
        date.setUTCMinutes(0);
        date.setUTCHours(0);
    } else {
        date.setMilliseconds(0);
        date.setSeconds(0);
        date.setMinutes(0);
        date.setHours(0);
    }
    return date;
};

export const today = (): Date => {
    const today = getCurrentDate();
    toDayStart(today);
    return today;
};

const isCurrentYear = (date: Date): boolean => {
    const current_date = getCurrentDate();
    const current_year = current_date.getFullYear();
    const source_year = date.getFullYear();
    return current_year === source_year;
};

export const addDays = (date: Date, days: number): Date => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
};

export const daysDiff = (first: Date, second: Date) => {
    const firstDate = Date.UTC(first.getFullYear(), first.getMonth(), first.getDate());
    const secondDate = Date.UTC(second.getFullYear(), second.getMonth(), second.getDate());

    return Math.ceil((secondDate - firstDate) / MS_PER_DAY);
};

export const getDayOfWeek = (date: Date): number => {
    return (7 + date.getDay() - currentCultureSettings.firstDay) % 7;
};

const compareYears = (firstDate: Date, secondDate: Date): boolean => {
    if (!firstDate && !secondDate) {
        return true;
    }

    if (!firstDate || !secondDate) {
        return false;
    }

    return firstDate.getFullYear() === secondDate.getFullYear();
};

export const formatAsShort = (date: Date, nullText?: string): string => {
    if (date) {
        return date.toLocaleDateString(undefined, {
            month: 'short',
            day: '2-digit',
        });
    }
    return nullText || '';
};

const formatAsMediumFullYear = (date: Date): string => {
    return date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
    });
};

const formatAsMediumOrShort = (date: Date, alwaysShowYear: boolean = false): string => {
    if (!date) {
        return '';
    }

    return isCurrentYear(date) && !alwaysShowYear ? formatAsShort(date) : formatAsMediumFullYear(date);
};

export const formatDatesRange = (start: Date, end: Date, options: { alwaysShowYear?: boolean } = {}): string => {
    const { alwaysShowYear } = { alwaysShowYear: false, ...options };

    if (start && end) {
        let result;
        const isCompareYear = compareYears(start, end);

        if (isCompareYear) {
            result = formatAsShort(start) + separator + formatAsMediumOrShort(end, alwaysShowYear);
        } else {
            result = formatAsMediumFullYear(start) + separator + formatAsMediumFullYear(end);
        }

        return result;
    }

    if (start) {
        return formatAsMediumOrShort(start, alwaysShowYear) + separator + ellipses;
    }

    return ellipses + separator + formatAsMediumOrShort(end, alwaysShowYear);
};

const formatAsDayNameMin = (date: Date): string => {
    if (date) {
        return date.toLocaleDateString(undefined, {
            weekday: 'short',
        });
    }

    return '';
};

export const formatAsDayNameFirstLetter = (date: Date): string => {
    if (date) {
        return formatAsDayNameMin(date).charAt(0);
    }
    return '';
};
