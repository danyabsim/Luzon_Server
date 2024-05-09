import {sendResponse} from "./ServerFunctions.js";
import {users} from "../Data/Data.js";

export function userFunctions(requestData, res, req) {
    if (req.url === '/addUser') users = users.push({username: requestData.username, password: requestData.password, isAdmin: requestData.isAdmin});
    if (req.url === '/removeUser') users = users.filter(entry => entry.username !== requestData.username);
    sendResponse(res, 200, users.map(user => user.username));
}