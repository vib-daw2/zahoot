import { io } from 'socket.io-client';

// "undefined" means the URL will be computed from the `window.location` object
const URL = process.env.NODE_ENV === 'production' ? undefined : 'http://localhost:3000';

//export const socket = io("http://localhost:3000");
export const socket = io(import.meta.env.VITE_SOCKET_URL ?? "http://192.168.85.8:3000/")