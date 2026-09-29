import { Server } from 'socket.io';

let io;

export function setupSocket(server) {
  io = new Server(server, {
    // Vite's HMR websocket shares this HTTP server in dev; don't let
    // Socket.IO close upgrade requests that aren't addressed to it.
    destroyUpgrade: false,
  });

  io.on('connection', (socket) => {
    console.log(`socket connected: ${socket.id}`);
    socket.emit('message', { text: 'Welcome! You are connected.', time: new Date().toISOString() });

    socket.on('disconnect', (reason) => {
      console.log(`socket disconnected: ${socket.id} (${reason})`);
    });
  });

  // Demo: push a server message to every client every 5 seconds.
  setInterval(() => {
    io.emit('message', { text: `Server tick — ${io.engine.clientsCount} client(s) connected`, time: new Date().toISOString() });
  }, 1000);

  return io;
}

// Lets other modules (e.g. API routes) broadcast to connected clients.
export function getIO() {
  if (!io) throw new Error('Socket.IO has not been initialised');
  return io;
}
