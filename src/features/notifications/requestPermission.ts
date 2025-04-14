export async function requestPermission() {
  if (!Notification || !Notification.requestPermission) {
    return false;
  }

  const result = await Notification.requestPermission();
  if (result === "denied") {
    return false;
  }
  if (result === "granted") {
    return false;
  }
}
