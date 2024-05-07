import {createServer} from 'http';
import cors from 'cors';
import {notFoundResponse, sendResponse} from "./Functions/ServerFunctions.js";
import {corsOptions, users} from "./Data/Data.js";
import {eventFunctions} from "./Functions/EventFunctions.js";

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
                    case '/addEvent':
                    case '/removeEvent':
                        eventFunctions(requestData, res, req);
                        break;
                    case '/getAllUsersNames':
                        sendResponse(res, 200, users.map(user => user.username));
                        break;
                    case '/addUser':
                        users = users.push({username: requestData.username, password: requestData.password, isAdmin: requestData.isAdmin});
                        break;
                    case '/removeUser':
                        users = users.filter(entry => entry.username !== requestData.username);
                        break;
                    case '/changePassword':
                        const {username, password, newPassword} = requestData;
                        const userIndex = users.findIndex(user => user.username === username && user.password === password);
                        if (userIndex !== -1) users[userIndex].password = newPassword;
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