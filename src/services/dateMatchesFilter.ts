import { Task } from "../types/SaveFile";

export const dateMatchesFilter = (d: Date, filters: Task["filters"]) => {
  const dayOfMonth = d.getDate();
  if (filters.date && !filters.date.some((f) => f === dayOfMonth)) {
    return false;
  }

  const dayOfWeek = d.getDay();
  if (filters.day && !filters.day.some((f) => f === dayOfWeek)) {
    return false;
  }

  const month = d.getMonth();
  if (filters.month && !filters.month.some((f) => f === month)) {
    return false;
  }

  return true;
};
