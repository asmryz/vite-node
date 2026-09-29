import { useEffect } from 'react';
import { io } from 'socket.io-client';

// One shared connection for the whole app (same origin, so no URL needed).
// It only connects while at least one component is using it.
const socket = io({ autoConnect: false });
let users = 0;

export default function useSocket() {
  useEffect(() => {
    users += 1;
    if (users === 1) socket.connect();

    return () => {
      users -= 1;
      if (users === 0) socket.disconnect();
    };
  }, []);

  return socket;
}
