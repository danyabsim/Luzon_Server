import {createServer} from 'http';
import cors from 'cors';
import {notFoundResponse, sendResponse, extractDateAndFindUser} from "./Functions/ServerFunctions.js";
const {sendNotification} = require('./Functions/Notifications.js');
const schedule = require('node-schedule');

let users = [
    {username: 'admin', password: 'admin', image: null, isAdmin: true, token: ''},
];

let userHistory = [];

const corsOptions = {
    origin: '*',
    methods: 'GET, POST, PUT, DELETE'
};

const server = createServer((req, res) => {
    cors(corsOptions)(req, res, () => {
        if (req.method === 'POST') {
            let body = '';
            req.on('data', chunk => {
                body += chunk;
            });
            req.on('end', () => {
                const requestData = JSON.parse(body);
                switch (req.url) {
                    case '/connect':
                        const userIndexConnect = users.findIndex(u => u.username === requestData.username && u.password === requestData.password);
                        if (userIndexConnect !== -1) {
                            users[userIndexConnect].token = requestData.token;
                            if (users[userIndexConnect].isAdmin) sendResponse(res, 200, {isAdmin: user.isAdmin, image: user.image, userHistory: userHistory});
                            else {
                                const userSpecificHistory = userHistory.filter(entry => entry.name.includes(`(${user.username})`));
                                sendResponse(res, 200, {isAdmin: user.isAdmin, image: user.image, userHistory: userSpecificHistory});
                            }
                        } else {
                            sendResponse(res, 404, 'User not found');
                        }
                        break;
                    case '/logout':
                        const userIndexLogout = users.findIndex(u => u.username === requestData.username);
                        if (userIndexLogout !== -1 && requestData.isRememberMeOn === false) users[userIndexLogout].token = '';
                        break;
                    case '/addEvent':
                        userHistory.push({name: requestData.name, height: requestData.height, day: requestData.day});
                        const { date, eventUser } = extractDateAndFindUser(requestData.name, users);
                        schedule.scheduleJob(date, sendNotification(eventUser.token));
                        break;
                    case '/removeEvent':
                        let indexToRemove = userHistory.findIndex(entry => entry.name === requestData.name && entry.height === requestData.height);
                        while (indexToRemove !== -1) {
                            userHistory.splice(indexToRemove, 1);
                            indexToRemove = userHistory.findIndex(entry => entry.name === requestData.name && entry.height === requestData.height);
                        }
                        break;
                    case '/getAllUserNames':
                        sendResponse(res, 200, users.map(user => user.username));
                        break;
                    case '/addUser':
                        if (users.findIndex(entry => entry.username === requestData.username) === -1) users.push({username: requestData.username, password: requestData.password, image: null, isAdmin: requestData.isAdmin});
                        break;
                    case '/removeUser':
                        users = users.filter(entry => entry.username !== requestData.username);
                        break;
                    case '/changePassword':
                        const userIndex = users.findIndex(user => user.username === requestData.username && user.password === requestData.password);
                        if (userIndex !== -1) users[userIndex].password = requestData.newPassword;
                        break;
                    case '/changeImage':
                        const index = users.findIndex(user => user.username === requestData.username && user.password === requestData.password);
                        if (index !== -1) users[index].image = requestData.image;
                        break;
                    default:
                        notFoundResponse(res);
                        break;
                }
            });
        } else notFoundResponse(res);
    });
});

const port = 3000;
server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});