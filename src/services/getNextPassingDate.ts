import { Task } from "../types/SaveFile";
import { dateMatchesFilter } from "./dateMatchesFilter";

export function getNextPassingDate(
  date: Date,
  filters: Task["filters"],
  checkStartDate = false) {
  const incrementDate = (d: Date) => {
    const nextDate = new Date(d.valueOf());
    if (!filters.interval) {
      console.log("Incrementing Single Day");
      nextDate.setDate(nextDate.getDate() + 1);
    } else {
      if (filters.interval.step === "day") {
        nextDate.setDate(nextDate.getDate() + filters.interval.length);
      } else if (filters.interval.step === "week") {
        nextDate.setDate(nextDate.getDate() + filters.interval.length * 7);
      } else if (filters.interval.step === "month") {
        nextDate.setMonth(nextDate.getMonth() + filters.interval.length);
      } else if (filters.interval.step === "year") {
        nextDate.setFullYear(nextDate.getFullYear() + filters.interval.length);
      }
    }

    return nextDate;
  };

  const isMatch = (d: Date) => dateMatchesFilter(d, filters);

  if (checkStartDate && isMatch(date)) {
    return date;
  }

  let tries = 0;
  let nextDate = incrementDate(date);
  while (tries < 1000 && !isMatch(nextDate)) {
    nextDate = incrementDate(nextDate);
    tries += 1;
  }

  return isMatch(nextDate) ? nextDate : null;
}
