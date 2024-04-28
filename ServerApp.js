import { createServer } from 'http';
import cors from 'cors';

const users = [
    { name: 'admin', pass: 'admin', isAdmin: true },
    { name: 'temp', pass: 'temp', isAdmin: false }
];

const userHistory = [
    { name: '17:00 – Cooking some meal (temp)', height: 10, day: '2024-04-28' },
    { name: '10:00 – Going to the gym (temp)', height: 10, day: '2024-04-28'},
    { name: '20:00 – Eating some chips (admin)', height: 10, day: '2024-04-30' }
];

const corsOptions = {
    origin: '*',
    methods: 'GET, POST, PUT, DELETE'
};

const server = createServer((req, res) => {
    // Use cors middleware
    cors(corsOptions)(req, res, () => {
        // Handle Axios requests
        if (req.url === '/connect' && req.method === 'POST') {
            let body = '';
            req.on('data', chunk => {
                body += chunk;
            });
            req.on('end', () => {
                const { name, pass } = JSON.parse(body);
                const user = users.find(u => u.name === name && u.pass === pass);
                if (user) {
                    if (user.isAdmin) {
                        // Return all userHistory to the client
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify(userHistory));
                    } else {
                        // Return only user's history
                        const userSpecificHistory = userHistory.filter(entry => {
                            const regex = new RegExp(`\\(${user.name}\\)$`);
                            return regex.test(entry.name);
                        });
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify(userSpecificHistory));
                    }
                } else {
                    // No user found, send false
                    res.writeHead(404, { 'Content-Type': 'text/plain' });
                    res.end('User not found');
                }
            });
        } else {
            // Handle other requests if needed
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Not Found');
        }
    });
});

const port = 3000;

server.listen(port, () => {
    console.log(`Axios Server is running on http://localhost:${port}`);
});
