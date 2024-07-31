export function sendResponse(res, statusCode, data) {
    res.writeHead(statusCode, {'Content-Type': 'application/json'});
    res.end(JSON.stringify(data));
}

export function notFoundResponse(res) {
    sendResponse(res, 404, 'Not Found');
}

export function extractDateAndFindUser(input) {
    // Define the regular expressions to capture the date and time part, and the username
    const dateRegex = /^(\d{4}-\d{2}-\d{2} \(\d{2}:\d{2}\))/;
    const usernameRegex = /\(([^)]+)\)\x00/;

    const dateMatch = input.match(dateRegex);
    const usernameMatch = input.match(usernameRegex);

    if (dateMatch && usernameMatch) {
        // Extract the date and time portion
        const dateTimeStr = dateMatch[1].replace(/[()]/g, ''); // Remove parentheses
        // Replace space with 'T' to create a valid ISO 8601 format
        const isoDateTimeStr = dateTimeStr.replace(' ', 'T');
        // Convert to a Date object
        const date = new Date(isoDateTimeStr);

        // Extract the username
        const eventUsername = usernameMatch[1];

        return { date, eventUsername };
    }
}