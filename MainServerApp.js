import { fastify } from 'fastify';
import cors from '@fastify/cors';

let users = [
    {username: 'admin', password: 'admin', isAdmin: true},
    {username: 'temp', password: 'temp', isAdmin: false},
];

let userHistory = [];

const app = new fastify({logger: true});

app.register(cors, {
    origin: '*',
    methods: 'GET, POST, PUT, DELETE'
});

app.post('/connect', async (request, reply) => {
    const requestData = request.body;
    const user = users.find(u => u.username === requestData.username && u.password === requestData.password);
    if (user) {
        if (user.isAdmin) return {isAdmin: user.isAdmin, userHistory: userHistory};
        else {
            const userSpecificHistory = userHistory.filter(entry => entry.name.includes(`(${user.username})`) || entry.name.includes(`(All Users)`));
            return {isAdmin: user.isAdmin, userHistory: userSpecificHistory};
        }
    } else {
        reply.code(404).send({
            error: 'Not Found',
            message: 'The route you are looking for does not exist',
            statusCode: 404
        });
    }
});

app.post('/addEvent', async (request, reply) => {
    const requestData = request.body;
    userHistory.push({name: requestData.name, height: requestData.height, day: requestData.day});
});

app.post('/removeEvent', async (request, reply) => {
    const requestData = request.body;
    let indexToRemove = userHistory.findIndex(entry => entry.name === requestData.name && entry.height === requestData.height);
    while (indexToRemove !== -1) {
        userHistory.splice(indexToRemove, 1);
        indexToRemove = userHistory.findIndex(entry => entry.name === requestData.name && entry.height === requestData.height);
    }
});

app.post('/getAllUserNames', (request, reply) => {
    return users.map(user => user.username);
});

app.post('/addUser', async (request, reply) => {
    const requestData = request.body;
    if (users.findIndex(entry => entry.username === requestData.username) === -1) {
        users.push({username: requestData.username, password: requestData.password, isAdmin: requestData.isAdmin});
    }
});

app.post('/removeUser', async (request, reply) => {
    const requestData = request.body;
    users = users.filter(entry => entry.username !== requestData.username);
    userHistory = userHistory.filter(entry => !(entry.name.includes(`(${requestData.username.username})`) || requestData.username.name.includes(`(All Users)`)));
});

app.post('/changePassword', async (request, reply) => {
    const requestData = request.body;
    const userIndex = users.findIndex(user => user.username === requestData.username && user.password === requestData.password);
    if (userIndex !== -1) users[userIndex].password = requestData.newPassword;
});

app.setNotFoundHandler((request, reply) => {
    reply.code(404).send({
        error: 'Not Found',
        message: 'The route you are looking for does not exist',
        statusCode: 404
    });
});

const start = async () => {
    try {
        await app.listen({ port: 3000 });
        console.log(`Server listening at http://localhost:3000`);
    } catch (err) {
        app.log.error(err);
        process.exit(1);
    }
}
start();