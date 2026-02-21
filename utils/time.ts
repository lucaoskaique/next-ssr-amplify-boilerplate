export function formatMinutes(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;

  if (minutes <= 0) {
    return 'None';
  }

  if (h < 1) {
    return `${m} minute` + (m === 1 ? '' : 's');
  } else if (h > 0 && m === 0) {
    return h + ' hour' + (h === 1 ? '' : 's');
  } else {
    const parts = [];

    parts.push(`${h}h`);

    if (m > 0) {
      parts.push(`${m}m`);
    }

    return parts.join(' ');
  }
}

export function getStartOfDay(date: Date = new Date()): Date {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  return startOfDay;
}
