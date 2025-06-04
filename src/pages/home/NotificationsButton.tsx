import { faBell, faBellSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { getSubscription } from "../../features/notifications/getSubscription";
import { subscribe } from "../../features/notifications/subscribe";
import { useStorage } from "../../contexts/storage/useStorage";
import { cancelSubscription } from "../../features/notifications/cancelSubscription";

export function NotificationsButton() {
  const [subscription, setSubscription] = useState<
    PushSubscription | false | null
  >();

  useEffect(() => {
    getSubscription().then(setSubscription);
  }, []);

  const { data, save } = useStorage();

  useEffect(() => {
    if (data && (subscription === null || subscription)) {
      if (!data.subscription) {
        if (subscription) {
          data.subscription = JSON.parse(JSON.stringify(subscription));
          save(data);
        }
      } else {
        if (!subscription) {
          delete data.subscription;
          save(data);
        } else if (
          data.subscription.endpoint !== subscription.endpoint ||
          !data.subscription.keys
        ) {
          data.subscription = JSON.parse(JSON.stringify(subscription));
          save(data);
        }
      }
    }
  }, [data, save, subscription]);

  if (subscription === false || typeof subscription === "undefined") {
    return null;
  }

  return (
    <button
      className="btn btn-primary rounded-circle d-flex align-items-center justify-content-center"
      style={{ width: '3rem', height: '3rem'}}
      onClick={async () => {
        if (subscription) {
          if (await cancelSubscription()) {
            getSubscription().then(setSubscription);
          }
        } else {
          setSubscription(await subscribe())
        }
      }}
    >
      <FontAwesomeIcon className="fs-150" icon={subscription ? faBell : faBellSlash} />
    </button>
  );
}