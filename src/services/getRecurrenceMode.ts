import { RecurrenceType, Task } from '../types/SaveFile';

export function getRecurrenceMode(filters: Task['filters']) {
    if (typeof filters.type !== 'undefined') {
        return filters.type;
    }

    if (filters.day?.length) {
        return RecurrenceType.WeekDay;
    } else if (filters.date?.length) {
        return RecurrenceType.MonthDay;
    } else if (filters.interval?.step === 'day') {
        return RecurrenceType.IntervalDay;
    } else if (filters.interval?.step === 'week') {
        return RecurrenceType.IntervalWeek;
    } else if (filters.interval?.step === 'month') {
        return RecurrenceType.IntervalMonth;
    } else if (filters.interval?.step === 'year') {
        return RecurrenceType.IntervalYear;
    }
    return null;
}
