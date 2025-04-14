self.addEventListener("install", () => self.skipWaiting());

self.addEventListener("push", function (event) {
  const data = event.data?.json() ?? {};
  console.log("Received a push message", data);

  if (!(self.Notification && self.Notification.permission === "granted")) {
    return;
  }

  const title = data.title ?? "You have tasks due";
  const body = data.body ?? "Open tasks.n-lang.dev to view them";
  const icon = "/favicon.svg";
  const tag = new Date().valueOf().toFixed();

  event.waitUntil(
    self.registration.showNotification(title, {
      body: body,
      icon: icon,
      badge: icon,
      image: "/tasks-due.jpeg",
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
