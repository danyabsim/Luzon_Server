import {sendResponse} from "./ServerFunctions.js";
import {users, userHistory} from "../Data/Data.js";

export function eventFunctions(requestData, res, req) {
    const {username, password} = requestData;
    const user = users.find(u => u.username === username && u.password === password);
    if (req.url === '/addEvent') {
        const {name, height, day} = requestData;
        userHistory.push({name: name, height: height, day: day});
    } else if (req.url === '/removeEvent') {
        let indexToRemove = userHistory.findIndex(entry => entry.name === requestData.name);
        while (indexToRemove !== -1) {
            userHistory.splice(indexToRemove, 1)
            indexToRemove = userHistory.findIndex(entry => entry.name === requestData.name);
        }
    }
    if (user) {
        if (user.isAdmin) sendResponse(res, 200, {isAdmin: user.isAdmin, userHistory: userHistory});
        else {
            const userSpecificHistory = userHistory.filter(entry => entry.name.includes(`(${user.username})`));
            sendResponse(res, 200, {isAdmin: user.isAdmin, userSpecificHistory});
        }
    } else {
        sendResponse(res, 404, 'User not found');
    }
}