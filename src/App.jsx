import { useEffect, useState } from 'react';
import useSocket from './hooks/useSocket.js';

export default function App() {
  const [name, setName] = useState('');
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const socket = useSocket();
  const [connected, setConnected] = useState(socket.connected);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const onConnect = () => setConnected(true);
    const onDisconnect = () => setConnected(false);
    const onMessage = (msg) => setMessages((prev) => [msg, ...prev].slice(0, 20));

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('message', onMessage);

    // Remove only this component's listeners; the connection is shared.
    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('message', onMessage);
    };
  }, [socket]);

  async function sayHello(n = name) {
    setError(null);
    try {
      const qs = n ? `?name=${encodeURIComponent(n)}` : '';
      const res = await fetch(`/api/hello${qs}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setData(await res.json());
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    sayHello('');
  }, []);

  return (
    <main className="container">
      <h1>Vite + Express + React</h1>
      <p className="muted">
        The frontend is served by Vite; <code>/api/*</code> is handled by Express — same port.
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          sayHello();
        }}
      >
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
        <button type="submit">Call /api/hello</button>
      </form>

      {error && <p className="error">Error: {error}</p>}
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}

      <section>
        <h2>
          Live messages{' '}
          <small className={connected ? 'status online' : 'status offline'}>
            {connected ? '● connected' : '○ disconnected'}
          </small>
        </h2>
        {messages.length === 0 ? (
          <p className="muted">Waiting for messages…</p>
        ) : (
          <ul className="messages">
            {messages.map((m, i) => (
              <li key={`${m.time}-${i}`}>
                <span className="muted">{new Date(m.time).toLocaleTimeString()}</span> {m.text}
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
