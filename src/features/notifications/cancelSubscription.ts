import { canSubscribe } from "./canSubscribe";

export async function cancelSubscription() {
  if (!canSubscribe()) {
    return;
  }

  const registration = await navigator.serviceWorker.getRegistration();
  if (
    !registration ||
    !registration.pushManager ||
    !registration.pushManager.getSubscription
  ) {
    return false;
  }

  return await registration.pushManager
    .getSubscription()
    .then((subscription) => subscription?.unsubscribe());
}
