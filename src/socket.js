// import EndPoints from './http/endpoints';
import io from "socket.io-client";
// import { getServerUrl } from "./config";
const socketUrl = `http://localhost:8000`;
// const socketUrl = `${getServerUrl()}`;
// const socketUrl = EndPoints.SOCKET_BASE;
let socketOptions = { transports: ["websocket"] }
let socket;
let socketId;
const connectSocket = () => {
    if (!socket) {
        socket = io(socketUrl, socketOptions);
        socket.on('connect', () => {
            socketId = socket.id;
            console.log(`Connected to Server`);
        });
        socket.on('disconnect', () => {
            console.log(`Disconnected from Server`);
        });
    }
}
export { connectSocket, socket, socketId };