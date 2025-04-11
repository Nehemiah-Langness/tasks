import { translateDayOfWeek } from "./translateDayOfWeek";

export function formatDate(
  date: number | Date,
  components: {
    day?: boolean;
    date?: boolean;
    time?: boolean;
  } = { date: true, day: true, time: true }) {
  const dateObject = typeof date === "number" ? new Date(date) : date;

  const day = dateObject.getDate();
  const month = dateObject.getMonth();
  const year = dateObject.getFullYear();
  const minute = dateObject.getMinutes();
  const second = dateObject.getSeconds();
  const hour = dateObject.getHours();
  const dayOfWeek = dateObject.getDay();

  const dayFormatted = components.day ? translateDayOfWeek(dayOfWeek) : "";
  const dateFormatted = components.date ? `${month + 1}/${day}/${year}` : "";
  const timeFormatted = components.time
    ? `${((hour + 12 - 1) % 12) + 1}:${minute
      .toString()
      .padStart(2, "0")}:${second.toString().padStart(2, "0")} ${hour < 12 ? "am" : "pm"}`
    : "";

  return [
    dayFormatted,
    [dateFormatted, timeFormatted].filter((x) => x).join(" "),
  ]
    .filter((x) => x)
    .join(", ");
}
