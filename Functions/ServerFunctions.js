export function sendResponse(res, statusCode, data) {
    res.writeHead(statusCode, {'Content-Type': 'application/json'});
    res.end(JSON.stringify(data));
}

export function notFoundResponse(res) {
    sendResponse(res, 404, 'Not Found');
}