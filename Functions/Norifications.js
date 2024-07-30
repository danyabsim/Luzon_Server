const fetch = require('node-fetch');

export const sendNotification = async (token: string) => {
    const message = {
        to: token,
        sound: 'default',
        title: 'Start of an event',
        body: 'Enter to the app for more details',
        data: { someData: 'goes here' },
    };

    await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Accept-encoding': 'gzip, deflate',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
    });
};