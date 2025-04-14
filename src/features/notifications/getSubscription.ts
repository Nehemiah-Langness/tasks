import { canSubscribe } from "./canSubscribe";

export async function getSubscription() {
  if (!(await canSubscribe())) {
    return false;
  }

  const registration = await navigator.serviceWorker.getRegistration();
  if (
    !registration ||
    !registration.pushManager ||
    !registration.pushManager.getSubscription
  ) {
    console.log('registration', registration)
    return false;
  }

  return await registration.pushManager.getSubscription();
}
