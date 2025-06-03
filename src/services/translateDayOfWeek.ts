export function translateDayOfWeek(day: number, short = false) {
    if (short) return ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'][day] ?? '';
    return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][day] ?? '';
}
