import { io } from 'socket.io-client';

const supportHost = import.meta.env.VITE_WS_SUPPORT_HOST;

export const socket = io(supportHost, {
  transports: ['websocket'],
});
