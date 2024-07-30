export function extractAndConvertDate(input) {
    // Define the regular expression to capture the date and time part
    const regex = /^(\d{4}-\d{2}-\d{2} \(\d{2}:\d{2}\))/;
    const match = input.match(regex);

    if (match) {
        // Extract the date and time portion
        const dateTimeStr = match[1].replace(/[()]/g, ''); // Remove parentheses
        // Replace space with 'T' to create a valid ISO 8601 format
        const isoDateTimeStr = dateTimeStr.replace(' ', 'T');
        // Convert to a Date object
        return new Date(isoDateTimeStr);
    } else {
        throw new Error("Invalid input string format");
    }
}