import { Task } from '../types/SaveFile';
import { formatDate } from './formatDate';

type FormatDateParams = Parameters<typeof formatDate>;

export class Tasks {
    static complete(task: Task) {
        const today = Dates.today().valueOf();
        const tomorrow = Dates.increment(today, 1, 'day');
        task.lastCompleted = today;
        task.dueDate = (Tasks.nextDueDate(task.startDate, task.filters, tomorrow) ?? tomorrow).valueOf();
        task.startDate = task.dueDate;
        console.log(task);
    }

    static normalize(task: Task) {
        // Ensure Start Date exists on task
        if (typeof task.startDate !== 'number') {
            const oldFormatStartDate = (task.filters?.interval as { startDate: number } | undefined)?.startDate;
            task.startDate = (oldFormatStartDate ? Dates.date(oldFormatStartDate) : Dates.today()).valueOf();
        }

        if (task.lastCompleted) {
            task.lastCompleted = Dates.date(task.lastCompleted).valueOf();
        }

        task.startDate = Dates.date(task.startDate).valueOf();

        if (!Tasks.dateMatchesFilter(task.startDate, task.filters)) {
            task.startDate = (
                Tasks.nextDueDate(task.startDate, {
                    ...task.filters,
                    interval: {
                        length: 1,
                        step: 'day',
                    },
                }) ?? Dates.today()
            ).valueOf();
        }
        task.dueDate = Tasks.nextDueDate(task.startDate, task.filters, task.lastCompleted ?? task.startDate)?.valueOf() ?? task.startDate;

        if (task.lastCompleted && task.startDate < task.lastCompleted) {
            task.startDate = task.dueDate;
        }
    }

    static dateMatchesFilter(date: Date | number, filters: Task['filters']) {
        const dateObject = Dates.date(date);

        const dayOfMonth = dateObject.getUTCDate();
        if (filters.date && !filters.date.some((f) => f === dayOfMonth)) {
            return false;
        }

        const dayOfWeek = dateObject.getUTCDay();
        if (filters.day && !filters.day.some((f) => f === dayOfWeek)) {
            return false;
        }

        const month = dateObject.getUTCMonth();
        if (filters.month && !filters.month.some((f) => f === month)) {
            return false;
        }

        return true;
    }

    static nextDueDate(date: Date | number, filters: Task['filters'], minDate?: Date | number) {
        const minDateValue = minDate ? Dates.date(minDate) : null;
        const meetsCriteria = (d: Date) => Tasks.dateMatchesFilter(d, filters) && (!minDateValue || d.valueOf() >= minDateValue.valueOf());

        let dateObject = Dates.date(date);
        let tries = 0;
        while (tries < 1000 && !meetsCriteria(dateObject)) {
            dateObject = Dates.increment(dateObject, filters.interval?.length ?? 1, filters.interval?.step ?? 'day');
            tries += 1;
        }

        return meetsCriteria(dateObject) ? dateObject : null;
    }
}

export class Dates {
    static today() {
        return Dates.date(Date.now());
    }

    private static millisecondsPerDay = 24 * 60 * 60 * 1000;

    static daysBetween(startDate: Date | number, endDate: Date | number) {
        return Math.round((Dates.treatAsUTC(endDate).valueOf() - Dates.treatAsUTC(startDate).valueOf()) / Dates.millisecondsPerDay);
    }

    private static treatAsUTC(date: Date | number) {
        const result = new Date(date);
        result.setMinutes(result.getMinutes() - result.getTimezoneOffset());
        return result;
    }

    static increment(date: Date | number, amount: number, interval: 'day' | 'week' | 'month' | 'year') {
        const dateObject = Dates.date(date);
        if (interval === 'day') {
            dateObject.setUTCDate(dateObject.getUTCDate() + amount);
        } else if (interval === 'week') {
            dateObject.setUTCDate(dateObject.getUTCDate() + amount * 7);
        } else if (interval === 'month') {
            dateObject.setUTCMonth(dateObject.getUTCMonth() + amount * 7);
        }

        return dateObject;
    }

    static format(date: Date | number, format?: FormatDateParams[1], local?: FormatDateParams[2]) {
        return formatDate(
            date,
            format ?? {
                date: true,
                day: true,
            },
            local ?? false
        );
    }

    static date(date: Date | number) {
        const dateObject = typeof date === 'number' ? new Date(date) : date;
        return new Date(dateObject.getUTCFullYear(), dateObject.getUTCMonth(), dateObject.getUTCDate());
    }
}
