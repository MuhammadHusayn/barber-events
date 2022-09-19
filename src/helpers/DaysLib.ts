export class DaysLib {
    static sundayCounter(start: Date, end: Date) {
        const dayNum = 0;
        const daysInInterval = Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24));
        const toNextTargetDay = (7 + dayNum - start.getDay()) % 7;
        const daysFromFirstTargetDay = Math.max(daysInInterval - toNextTargetDay, 0);
        return Math.ceil(daysFromFirstTargetDay / 7);
    }

    static getWeekDays(start: Date, end: Date) {
        const daysInInterval = Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24));
        return daysInInterval - DaysLib.sundayCounter(start, end);
    }

    static getDaysInRange(start: Date, end: Date) {
        const date = new Date(start.getTime());

        const dates = [];

        while (date <= end) {
            const [perDate] = new Date(date).toISOString().split('T');
            dates.push(perDate);
            date.setDate(date.getDate() + 1);
        }

        return dates;
    }

    static formatDate(dateTime: Date) {
        const dateArray = dateTime
            .toLocaleString('uz-UZ', { timeZone: 'Asia/Tashkent' })
            .replaceAll('/', '-')
            .replace(',', '')
            .split(' ');

        return dateArray[0].split('-').reverse().join('-') + ' ' + dateArray[1];
    }
}
