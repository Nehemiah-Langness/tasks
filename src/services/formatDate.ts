import { Dates } from './dates';
import { translateDayOfWeek } from './translateDayOfWeek';

export function formatDate(
    date: number | Date,
    components: {
        day?: boolean;
        date?: boolean;
        time?: boolean;
        summarize?: boolean;
    } = { date: true, day: true, time: true, summarize: false },
    local = true
) {
    const dateObject = typeof date === 'number' ? new Date(date) : date;

    if (components.summarize) {
        const daysBetween = Dates.daysBetween(dateObject, Dates.today());

        if (daysBetween === 0) {
            return 'Today';
        } else if (daysBetween === 1) {
            return 'Yesterday';
        } else if (daysBetween === -1) {
            return 'Tomorrow';
        } else if (daysBetween > -6 && daysBetween < 0) {
            return `In ${Math.abs(daysBetween)} days`;
        } else if (daysBetween > 0 && daysBetween < 6) {
            return `${Math.abs(daysBetween)} days ago`;
        }
    }

    const day = local ? dateObject.getDate() : dateObject.getUTCDate();
    const month = local ? dateObject.getMonth() : dateObject.getUTCMonth();
    const year = local ? dateObject.getFullYear() : dateObject.getUTCFullYear();
    const minute = local ? dateObject.getMinutes() : dateObject.getUTCMinutes();
    const second = local ? dateObject.getSeconds() : dateObject.getUTCSeconds();
    const hour = local ? dateObject.getHours() : dateObject.getUTCHours();
    const dayOfWeek = local ? dateObject.getDay() : dateObject.getUTCDay();

    const dayFormatted = components.day ? translateDayOfWeek(dayOfWeek) : '';
    const dateFormatted = components.date ? `${month + 1}/${day}/${year}` : '';
    const timeFormatted = components.time
        ? `${((hour + 12 - 1) % 12) + 1}:${minute.toString().padStart(2, '0')}:${second.toString().padStart(2, '0')} ${
              hour < 12 ? 'am' : 'pm'
          }`
        : '';

    return [dayFormatted, [dateFormatted, timeFormatted].filter((x) => x).join(' ')].filter((x) => x).join(', ');
}
