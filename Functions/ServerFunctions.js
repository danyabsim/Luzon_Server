export function sendResponse(c, statusCode, data) {
    return c.json(data, statusCode);
}