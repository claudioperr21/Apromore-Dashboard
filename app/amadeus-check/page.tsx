'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/supabase';

const BUILT_API = process.env.NEXT_PUBLIC_API_URL;

interface ConfirmData {
  source: string;
  table: string;
  rowCount: number;
  columns: string[];
  sample: Array<{
    Case_ID: string;
    Window: string;
    Activity: string;
    duration_seconds: number;
  }>;
}

export default function AmadeusCheck() {
  const [status, setStatus] = useState('checking...');
  const [data, setData] = useState<ConfirmData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const response = await fetch(api('/amadeus/_confirm'));
        const result = await response.json();
        
        if (result.success) {
          setData(result);
          setStatus('OK');
        } else {
          setError(result.error || 'Unknown error');
          setStatus('ERROR');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Network error');
        setStatus('ERROR');
      }
    };

    checkConnection();
  }, []);

  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Amadeus Data Connection Check</h1>
      
      <div className="space-y-3">
        <div>
          <b>API Base (built):</b> {String(BUILT_API)}
        </div>
        
        <div>
          <b>Status:</b> {status}
        </div>
        
        {error && (
          <div className="text-red-600">
            <b>Error:</b> {error}
          </div>
        )}
        
        {data && (
          <>
            <div>
              <b>Source:</b> {data.source}
            </div>
            
            <div>
              <b>Table:</b> {data.table}
            </div>
            
            <div>
              <b>Row Count:</b> {data.rowCount}
            </div>
            
            <div>
              <b>Columns:</b> {data.columns.join(', ')}
            </div>
            
            <div>
              <b>Sample Data (first 3 rows):</b>
              <pre className="mt-2 p-3 bg-gray-100 rounded text-sm overflow-auto">
                {JSON.stringify(data.sample, null, 2)}
              </pre>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
