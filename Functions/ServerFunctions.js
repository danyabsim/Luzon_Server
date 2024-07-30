export function sendResponse(res, statusCode, data) {
    res.writeHead(statusCode, {'Content-Type': 'application/json'});
    res.end(JSON.stringify(data));
}

export function notFoundResponse(res) {
    sendResponse(res, 404, 'Not Found');
}

export function extractDateAndFindUser(input, users) {
    // Define the regular expressions to capture the date and time part, and the username
    const dateRegex = /^(\d{4}-\d{2}-\d{2} \(\d{2}:\d{2}\))/;
    const usernameRegex = /\(([^)]+)\)\\0/;

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
        const username = usernameMatch[1];

        // Find the user in the users array
        const user = users.find(user => user.username === username);

        return { date, user };
    } else {
        throw new Error("Invalid input string format");
    }
}