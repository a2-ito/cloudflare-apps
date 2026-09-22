export function unixToDate(unix: number, ms: boolean): Date {
  return new Date(ms ? unix : unix * 1000);
}

export function dateToUnix(date: Date, ms: boolean): number {
  return ms ? date.getTime() : Math.floor(date.getTime() / 1000);
}
