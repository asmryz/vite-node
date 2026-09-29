import { useEffect, useState } from 'react';

export default function App() {
  const [name, setName] = useState('');
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

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
    </main>
  );
}
