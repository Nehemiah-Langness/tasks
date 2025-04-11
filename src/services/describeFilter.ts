import { translateDayOfWeek } from "./translateDayOfWeek";
import { Task } from "../types/SaveFile";
import { getRecurrenceMode } from "./getRecurrenceMode";

export function describeFilter(filters: Task["filters"]) {
  const mode = getRecurrenceMode(filters);
  if (mode === "dayOfWeek") {
    const weekInterval = filters.interval?.length ?? 1;
    return `Every ${
      weekInterval === 1
        ? ""
        : weekInterval === 2
        ? " other "
        : weekInterval === 3
        ? " 3rd "
        : ` ${weekInterval}th `
    } ${translateDayOfWeek(filters.day?.[0] ?? 0)}`;
  } else if (mode === "dayOfMonth") {
    const dayOfMonth = filters.date?.[0] ?? 1;
    const interval = filters.interval?.length ?? 1;
    return `The ${dayOfMonth}${
      dayOfMonth === 1
        ? "st"
        : dayOfMonth === 2
        ? "nd"
        : dayOfMonth === 3
        ? "rd"
        : "th"
    } of every  ${interval} Month${interval === 1 ? "" : "s"}`;
  } else if (mode === "everyDayInterval") {
    const interval = filters.interval?.length ?? 1;
    return `Every ${interval} Day${interval === 1 ? "" : "s"}`;
  }
}
