function helveticaneue() {
    const link = "https://raw.githubusercontent.com/vorlie/Theme-Fonts/main/HelveticaNeue-fonts.json";
    const notification_name = "Helvetica Neue font copied";
    const notification_body = "The link to the Helvetica Neue font has been copied to your clipboard.";
    const notification_icon = "https://us-east-1.tixte.net/uploads/you-all-have.no-friends.xyz/124.jpg";

    navigator.clipboard.writeText(link); // Add parentheses here

    if (Notification.permission === "granted") {
        const notification = new Notification(notification_name, {
            body: notification_body,
            icon: notification_icon
        });
        setTimeout(() => notification.close(), 5000);
    } else {
        Notification.requestPermission().then(permission => {
            if (permission === "granted") {
                const notification = new Notification(notification_name, {
                    body: notification_body,
                    icon: notification_icon
                });
                setTimeout(() => notification.close(), 5000);
            }
        });
    }
}
