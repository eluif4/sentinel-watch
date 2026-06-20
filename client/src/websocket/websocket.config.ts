import io, { Socket } from 'socket.io-client';

export let socket: Socket;
const ENDPOINT = import.meta.env.VITE_BACKEND_URL;

console.log(`Opening web socket to ${ENDPOINT}`);
socket = io(ENDPOINT);