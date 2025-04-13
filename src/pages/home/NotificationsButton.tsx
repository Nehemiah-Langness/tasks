import { faBell } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export function NotificationsButton() {
  return (
    <button
      className="btn btn-primary rounded-circle d-flex align-items-center justify-content-center"
      style={{ aspectRatio: 1 }}
      onClick={getNotificationsPermission}
    >
      <FontAwesomeIcon icon={faBell} />
    </button>
  );
}

async function getNotificationsPermission() {
  const reg = await navigator.serviceWorker.getRegistration();
  if (!reg) return false;
  return Notification.requestPermission().then((permission) => {
    if (permission !== "granted") {
      alert("you need to allow push notifications");
    } else {
      const timestamp = new Date().getTime() + 5 * 1000;
      reg.showNotification("Tasks are due today", {
        tag: timestamp.toFixed(), // a unique ID
        body: "You have (X) tasks due today", // content of the push notification
        requireInteraction: true,
        data: {
          url: window.location.href, // pass the current url to the notification
        },
        badge: "/favicon.svg",
        icon: "/favicon.svg",
        image: "/bg.png",
        timestamp: timestamp, // set the time for the push notification
        renotify: true,
      } as NotificationOptions);
    }
  });
}
