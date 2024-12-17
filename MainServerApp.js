import {sendResponse} from "./Functions/ServerFunctions.js";
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { serve } from '@hono/node-server';

let users = [
    {username: 'admin', password: 'admin', isAdmin: true},
    {username: 'temp', password: 'temp', isAdmin: false},
];

let userHistory = [];

const app = new Hono();

app.use('*', cors({
    origin: '*',
    methods: 'GET, POST, PUT, DELETE'
}));

app.post('/connect', async (c) => {
    const requestData = await c.req.json();
    const user = users.find(u => u.username === requestData.username && u.password === requestData.password);
    if (user) {
        if (user.isAdmin) return sendResponse(c, 200, {isAdmin: user.isAdmin, userHistory: userHistory});
        else {
            const userSpecificHistory = userHistory.filter(entry => entry.name.includes(`(${user.username})`) || entry.name.includes(`(All Users)`));
            return sendResponse(c, 200, {isAdmin: user.isAdmin, userHistory: userSpecificHistory});
        }
    } else {
        return sendResponse(c, 404, 'User not found');
    }
});

app.post('/addEvent', async (c) => {
    const requestData = await c.req.json();
    userHistory.push({name: requestData.name, height: requestData.height, day: requestData.day});
});

app.post('/removeEvent', async (c) => {
    const requestData = await c.req.json();
    let indexToRemove = userHistory.findIndex(entry => entry.name === requestData.name && entry.height === requestData.height);
    while (indexToRemove !== -1) {
        userHistory.splice(indexToRemove, 1);
        indexToRemove = userHistory.findIndex(entry => entry.name === requestData.name && entry.height === requestData.height);
    }
});

app.post('/getAllUserNames', (c) => {
    return sendResponse(c, 200, users.map(user => user.username));
});

app.post('/addUser', async (c) => {
    const requestData = await c.req.json();
    if (users.findIndex(entry => entry.username === requestData.username) === -1) {
        users.push({username: requestData.username, password: requestData.password, isAdmin: requestData.isAdmin});
    }
});

app.post('/removeUser', async (c) => {
    const requestData = await c.req.json();
    users = users.filter(entry => entry.username !== requestData.username);
    userHistory = userHistory.filter(entry => !(entry.name.includes(`(${requestData.username.username})`) || requestData.username.name.includes(`(All Users)`)));
});

app.post('/changePassword', async (c) => {
    const requestData = await c.req.json();
    const userIndex = users.findIndex(user => user.username === requestData.username && user.password === requestData.password);
    if (userIndex !== -1) users[userIndex].password = requestData.newPassword;
});

app.notFound((c) => {
    return sendResponse(c, 404, 'Not Found');
});

serve(app, (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
});