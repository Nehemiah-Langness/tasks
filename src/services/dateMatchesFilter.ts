import { Task } from '../types/SaveFile';

export const dateMatchesFilter = (d: Date, filters: Task['filters']) => {
    const dayOfMonth = d.getUTCDate();
    if (filters.date && !filters.date.some((f) => f === dayOfMonth)) {
        return false;
    }

    const dayOfWeek = d.getUTCDay();
    if (filters.day && !filters.day.some((f) => f === dayOfWeek)) {
        return false;
    }

    const month = d.getUTCMonth();
    if (filters.month && !filters.month.some((f) => f === month)) {
        return false;
    }

    return true;
};
