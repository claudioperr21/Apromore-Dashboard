'use client';
import { useEffect, useState } from 'react';
const BUILT_API = process.env.NEXT_PUBLIC_API_URL;

export default function EnvCheck() {
  const [status, setStatus] = useState('checking...');
  useEffect(() => {
    const base = (BUILT_API || '').replace(/\/+$/, '');
    fetch(`${base}/health`).then(r => setStatus(r.ok ? 'OK' : `HTTP ${r.status}`))
                           .catch(e => setStatus(`ERR ${e?.message||e}`));
  }, []);
  return (
    <main className="p-6 space-y-3">
      <h1 className="text-xl font-bold">Env Check</h1>
      <div><b>NEXT_PUBLIC_API_URL (built):</b> {String(BUILT_API)}</div>
      <div><b>Health:</b> {status}</div>
    </main>
  );
}
