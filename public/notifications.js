self.addEventListener("install", () => console.log("ServiceWorker installed"));

self.addEventListener("push", function (event) {
  const data = event.data?.text() ?? '';
  console.log("Received a push message", event, data);

  if (!(self.Notification && self.Notification.permission === "granted")) {
    return;
  }

  var title = "Yay a message.";
  var body = data;
  var icon = "/192.png";
  var tag = "simple-push-demo-notification-tag";

  event.waitUntil(
    self.registration.showNotification(title, {
      body: body,
      icon: icon,
      badge: icon,
      image: "/bg.png",
      tag: tag,
      renotify: true,
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.waitUntil(
    self.clients.matchAll().then((clients) => {
      if (clients.length) {
        clients[0].focus();
      } else {
        self.clients.openWindow("/");
      }
    })
  );
});
