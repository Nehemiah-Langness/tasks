import { treatAsUTC } from './treatAsUTC';

export function daysBetween(startDate: Date | number, endDate: Date | number) {
  const millisecondsPerDay = 24 * 60 * 60 * 1000;
  return (treatAsUTC(endDate).valueOf() - treatAsUTC(startDate).valueOf()) / millisecondsPerDay;
}
