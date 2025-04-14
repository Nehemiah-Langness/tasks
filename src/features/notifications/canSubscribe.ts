export async function canSubscribe() {
    if (!Notification || !Notification.requestPermission) {
        console.log('No Notification class')
        return false;
    }

    if (!navigator ||
        !navigator.serviceWorker ||
        !navigator.serviceWorker.getRegistration) {
        console.log('No serviceWorker')
        return false;
    }

    return true;
}
