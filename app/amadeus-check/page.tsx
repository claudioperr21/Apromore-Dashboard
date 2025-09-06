'use client';
import { useEffect, useState } from 'react';

export default function AmadeusCheck() {
  const built = process.env.NEXT_PUBLIC_API_URL;
  const [resp, setResp] = useState<any>(null);
  const [err, setErr] = useState<string>('');

  useEffect(() => {
    const base = (built || '').replace(/\/+$/, '');
    fetch(`${base}/amadeus/_confirm`)
      .then(r => r.json())
      .then(setResp)
      .catch(e => setErr(String(e)));
  }, [built]);

  return (
    <main className="p-6 space-y-2">
      <h1 className="text-xl font-bold">Amadeus Supabase Check</h1>
      <div><b>API Base (built):</b> {built}</div>
      {err && <div><b>Error:</b> {err}</div>}
      {resp && (
        <>
          <div><b>Table:</b> {resp.table}</div>
          <div><b>rowCount:</b> {resp.rowCount}</div>
          <pre className="text-sm bg-black/10 p-3 rounded">{JSON.stringify(resp.sample, null, 2)}</pre>
          <div className="font-semibold">
            {resp.table === 'amadeus_data' && typeof resp.rowCount === 'number'
              ? 'OK: Reading amadeus_data via Fly.io API'
              : 'FAILED: Unexpected response'}
          </div>
        </>
      )}
    </main>
  );
}
