const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * Границы календарного дня клиента в UTC.
 * tzOffsetMinutes — смещение часового пояса клиента (МСК = 180).
 */
export function dayRange(date: string, tzOffsetMinutes: number): { from: Date; to: Date } {
    const [year, month, day] = date.split('-').map(Number);
    const fromMs = Date.UTC(year, month - 1, day) - tzOffsetMinutes * 60 * 1000;
    return { from: new Date(fromMs), to: new Date(fromMs + DAY_MS) };
}

/** Дата в формате YYYY-MM-DD в часовом поясе клиента */
export function formatDay(date: Date, tzOffsetMinutes: number): string {
    return new Date(date.getTime() + tzOffsetMinutes * 60 * 1000).toISOString().slice(0, 10);
}

/** Сегодняшняя дата в часовом поясе клиента */
export function today(tzOffsetMinutes: number): string {
    return formatDay(new Date(), tzOffsetMinutes);
}

/** Сдвинуть дату YYYY-MM-DD на указанное число дней */
export function shiftDay(date: string, days: number): string {
    const [year, month, day] = date.split('-').map(Number);
    return new Date(Date.UTC(year, month - 1, day) + days * DAY_MS).toISOString().slice(0, 10);
}
