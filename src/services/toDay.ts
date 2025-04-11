
export function toDay(date: Date | number) {
  const dateObject = typeof date === "number" ? new Date(date) : date;
  dateObject.setHours(0, 0, 0, 0);
  return dateObject;
}
