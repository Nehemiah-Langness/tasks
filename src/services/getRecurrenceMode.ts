import { Task } from "../types/SaveFile";


export function getRecurrenceMode(filters: Task["filters"]) {
  if (filters.day?.length) {
    return "dayOfWeek" as const;
  } else if (filters.date?.length) {
    return "dayOfMonth" as const;
  } else if (filters.interval?.step === "day") {
    return "everyDayInterval" as const;
  }
  return null;
}
