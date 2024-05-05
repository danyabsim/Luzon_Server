import {createServer} from 'http';
import cors from 'cors';

const users = [
    {username: 'admin', password: 'admin', isAdmin: true},
    {username: 'temp', password: 'temp', isAdmin: false}
];

const userHistory = [
    {name: '10:00 – Going to the gym (temp)', height: 12463452, day: '2024-05-05'},
    {name: '17:00 – Cooking some meal (temp)', height: 0, day: '2024-05-05'},
    {name: '20:00 – Eating some chips (admin)', height: 255 * 255 * 255, day: '2024-05-05'}
];

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
                const {username, password} = requestData;
                const user = users.find(u => u.username === username && u.password === password);
                if (req.url === '/connect') {
                } else if (req.url === '/addEvent') {
                    const {name, height, day} = requestData;
                    userHistory.push({name: name, height: height, day: day});
                } else if (req.url === '/removeEvent') {
                    const indexToRemove = userHistory.findIndex(entry => entry.name === requestData.name && entry.day === requestData.day);
                    if (indexToRemove !== -1) userHistory.splice(indexToRemove, 1);
                } else{
                    notFoundResponse(res);
                }
                if (user) {
                    if (user.isAdmin) sendResponse(res, 200, userHistory);
                    else {
                        const userSpecificHistory = userHistory.filter(entry => entry.name.includes(`(${user.username})`));
                        sendResponse(res, 200, userSpecificHistory);
                    }
                } else {
                    sendResponse(res, 404, 'User not found');
                }
            });
        } else notFoundResponse(res);
    });
});

const port = 3000;
server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

function sendResponse(res, statusCode, data) {
    res.writeHead(statusCode, {'Content-Type': 'application/json'});
    res.end(JSON.stringify(data));
}

function notFoundResponse(res) {
    sendResponse(res, 404, 'Not Found');
}