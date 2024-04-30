import { createServer } from 'http';
import cors from 'cors';

// Dummy user data
const users = [
    { name: 'admin', pass: 'admin', isAdmin: true },
    { name: 'temp', pass: 'temp', isAdmin: false }
];

// Dummy user history data
const userHistory = [
    { name: '17:00 – Cooking some meal (temp)', height: 10, day: '2024-04-30' },
    { name: '10:00 – Going to the gym (temp)', height: 10, day: '2024-04-30' },
    { name: '20:00 – Eating some chips (admin)', height: 10, day: '2024-04-30' }
];

// CORS options
const corsOptions = {
    origin: '*',
    methods: 'GET, POST, PUT, DELETE'
};

// Create HTTP server
const server = createServer((req, res) => {
    // Enable CORS
    cors(corsOptions)(req, res, () => {
        if (req.method === 'POST') {
            let body = '';
            req.on('data', chunk => {
                body += chunk;
            });
            req.on('end', () => {
                const requestData = JSON.parse(body);
                if (req.url === '/connect') handleConnectRequest(requestData, res);
                else if (req.url === '/addEvent') handleAddHistoryRequest(requestData, res);
                else if (req.url === '/removeEvent') handleRemoveHistoryRequest(requestData, res);
                else notFoundResponse(res);
            });
        } else notFoundResponse(res);
    });
});

// Start the server
const port = 3000;
server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

// Handle '/connect' request
function handleConnectRequest(requestData, res) {
    const { name, pass } = requestData;
    const user = users.find(u => u.name === name && u.pass === pass);
    if (user) {
        if (user.isAdmin) {
            sendResponse(res, 200, userHistory);
        } else {
            const userSpecificHistory = userHistory.filter(entry => entry.name.includes(`(${user.name})`));
            sendResponse(res, 200, userSpecificHistory);
        }
    } else {
        sendResponse(res, 404, 'User not found');
    }
}

// Handle '/addEvent' request
function handleAddHistoryRequest(requestData, res) {
    userHistory.push(requestData);
    sendResponse(res, 200, userHistory);
}

// Handle '/removeEvent' request
function handleRemoveHistoryRequest(requestData, res) {
    const indexToRemove = userHistory.findIndex(entry => entry.name === requestData.name && entry.day === requestData.day);
    if (indexToRemove !== -1) userHistory.splice(indexToRemove, 1);
    sendResponse(res, 200, userHistory);
}

// Send response with given status code and data
function sendResponse(res, statusCode, data) {
    res.writeHead(statusCode, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
}

// Send 'Not Found' response
function notFoundResponse(res) {
    sendResponse(res, 404, 'Not Found');
}