import { getSubscription } from "./getSubscription";
import { requestPermission } from "./requestPermission";

const publicKey =
  "BGS_4Gg9Brhyu64RMx2_eiFhWyEbVKFuJviyHLW-87sk6l-J2QgxC-wnUlwqQQ2UJR1L4sqHNsis65ZuvHSmvSc";

export async function subscribe() {
  const subscription = await getSubscription();
  if (subscription === false) {
    return false;
  }
  if (subscription) {
    return subscription;
  }

  const hasPermission = requestPermission();
  if (!hasPermission) return false;

  const registration = await navigator.serviceWorker.getRegistration();
  if (!registration) {
    alert("Registration for notifications is not supported on this device");
    return;
  }
  return await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: publicKey,
  });
}
