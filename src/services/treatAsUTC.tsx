
export function treatAsUTC(date: Date | number) {
  const result = new Date(date);
  result.setMinutes(result.getMinutes() - result.getTimezoneOffset());
  return result;
}
