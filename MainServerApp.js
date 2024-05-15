import {createServer} from 'http';
import cors from 'cors';
import {notFoundResponse, sendResponse} from "./Functions/ServerFunctions.js";

let users = [
    {username: 'admin', password: 'admin', isAdmin: true},
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
                        const user = users.find(u => u.username === requestData.username && u.password === requestData.password);
                        if (user) {
                            if (user.isAdmin) sendResponse(res, 200, {isAdmin: user.isAdmin, userHistory: userHistory});
                            else {
                                const userSpecificHistory = userHistory.filter(entry => entry.name.includes(`(${user.username})`));
                                sendResponse(res, 200, {isAdmin: user.isAdmin, userHistory: userSpecificHistory});
                            }
                        } else {
                            sendResponse(res, 404, 'User not found');
                        }
                        break;
                    case '/addEvent':
                        const {name, height, day} = requestData;
                        userHistory.push({name: name, height: height, day: day});
                        break;
                    case '/removeEvent':
                        let indexToRemove = userHistory.findIndex(entry => entry.name === requestData.name);
                        while (indexToRemove !== -1) {
                            userHistory.splice(indexToRemove, 1)
                            indexToRemove = userHistory.findIndex(entry => entry.name === requestData.name);
                        }
                        break;
                    case '/getAllUserNames':
                        sendResponse(res, 200, users.map(user => user.username));
                        break;
                    case '/addUser':
                        users.push({username: requestData.username, password: requestData.password, isAdmin: requestData.isAdmin});
                        break;
                    case '/removeUser':
                        users = users.filter(entry => entry.username !== requestData.username);
                        break;
                    case '/changePassword':
                        const userIndex = users.findIndex(user => user.username === requestData.username && user.password === requestData.password);
                        if (userIndex !== -1) users[userIndex].password = requestData.newPassword;
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