// app/muke/page.tsx
"use client";

import { useState } from "react";

export default function MukePage() {
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  async function triggerDemo() {
    try {
      const res = await fetch("/api/hcss");
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError("Failed to call API");
      console.error(err);
    }
  }

  return (
    <div>
      <h1>Muke Page</h1>
      <button onClick={triggerDemo}>Run Demo HCS Transaction</button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {result && (
        <pre>{JSON.stringify(result, null, 2)}</pre>
      )}
    </div>
  );
}
