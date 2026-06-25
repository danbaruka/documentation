import React, {useEffect, useState} from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';

type Manifest = {
  chain_id: string;
  height: string;
  file: string;
  url?: string;
  sha256: string;
  size_bytes: number;
  size_human?: string;
  created: string; // YYYYMMDDTHHMMSSZ
};

function humanTime(ts: string): string {
  // "20260531T080608Z" → "2026-05-31 08:06:08 UTC"
  if (!ts || ts.length < 16) return ts;
  return `${ts.slice(0, 4)}-${ts.slice(4, 6)}-${ts.slice(6, 8)} ${ts.slice(9, 11)}:${ts.slice(11, 13)}:${ts.slice(13, 15)} UTC`;
}

function humanBytes(n: number): string {
  if (!n) return '0 B';
  const u = ['B', 'KB', 'MB', 'GB', 'TB'];
  let i = 0;
  let v = n;
  while (v >= 1024 && i < u.length - 1) {
    v /= 1024;
    i++;
  }
  return `${v.toFixed(v < 10 ? 2 : 1)} ${u[i]}`;
}

function Inner() {
  const [m, setM] = useState<Manifest | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    const url = 'https://snapshots.safrochain.network/latest.json';
    const ctl = new AbortController();
    fetch(url, {signal: ctl.signal, cache: 'no-store'})
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then(setM)
      .catch(e => setErr(String(e)));
    return () => ctl.abort();
  }, []);

  if (err) {
    return (
      <div style={{border: '1px solid #f0c8c8', background: '#fdf2f2', borderRadius: 8, padding: '0.9rem 1.1rem', margin: '1rem 0', fontSize: '0.92em'}}>
        <strong>Snapshot service unreachable.</strong>{' '}
        <code>https://snapshots.safrochain.network/latest.json</code> returned: {err}.<br />
        Try the steps below using the URL pattern directly, or check{' '}
        <a href="https://snapshots.safrochain.network/" target="_blank" rel="noreferrer">
          the snapshot index page
        </a>{' '}
        for current status.
      </div>
    );
  }

  if (!m) {
    return (
      <div style={{color: '#6b7385', fontStyle: 'italic', margin: '1rem 0'}}>
        Fetching latest snapshot info from snapshots.safrochain.network…
      </div>
    );
  }

  const row = (k: string, v: React.ReactNode) => (
    <tr>
      <td style={{color: '#6b7385', padding: '0.35rem 0.6rem 0.35rem 0', width: 130}}>{k}</td>
      <td style={{padding: '0.35rem 0', fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', wordBreak: 'break-all'}}>{v}</td>
    </tr>
  );

  return (
    <div style={{border: '1px solid #d6e0ee', background: '#f6f9fd', borderRadius: 8, padding: '1rem 1.25rem', margin: '1rem 0'}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.4rem'}}>
        <strong style={{fontSize: '1.05em'}}>Current latest snapshot</strong>
        <span style={{background: '#e8f5ec', color: '#166c2c', fontSize: '0.78em', padding: '0.12rem 0.5rem', borderRadius: 4}}>live</span>
      </div>
      <table style={{width: '100%', borderCollapse: 'collapse', fontSize: '0.94em'}}>
        <tbody>
          {row('Chain ID', m.chain_id)}
          {row('Height', m.height)}
          {row('Size', m.size_human ?? humanBytes(m.size_bytes))}
          {row('Created', humanTime(m.created))}
          {row('SHA-256', <span style={{fontSize: '0.85em'}}>{m.sha256}</span>)}
          {row('File', <a href={`https://snapshots.safrochain.network/${m.file}`} target="_blank" rel="noreferrer">{m.file}</a>)}
        </tbody>
      </table>
      <p style={{marginTop: '0.9rem', marginBottom: 0}}>
        <a
          href="https://snapshots.safrochain.network/latest.tar.lz4"
          style={{display: 'inline-block', background: '#1f6feb', color: '#fff', padding: '0.5rem 0.9rem', borderRadius: 6, fontWeight: 600, textDecoration: 'none'}}
        >
          Download latest
        </a>{' '}
        <a
          href="https://snapshots.safrochain.network/latest.json"
          style={{display: 'inline-block', background: '#444', color: '#fff', padding: '0.5rem 0.9rem', borderRadius: 6, fontWeight: 600, textDecoration: 'none', marginLeft: 6}}
        >
          Manifest (JSON)
        </a>
      </p>
    </div>
  );
}

export default function LiveSnapshotInfo() {
  // Wrap in BrowserOnly so SSR doesn't try to fetch at build time.
  return <BrowserOnly fallback={<div style={{color: '#6b7385'}}>Loading snapshot info…</div>}>{() => <Inner />}</BrowserOnly>;
}
