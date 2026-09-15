"use client";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body>
        <main style={{ maxWidth: 720, margin: "0 auto", padding: "4rem 1.25rem", fontFamily: "system-ui, sans-serif" }}>
          <p style={{ fontWeight: 700 }}>CalcuMint</p>
          <h1>Something went wrong.</h1>
          <p>We could not complete this request. Your calculator data has not been changed by this error.</p>
          <button type="button" onClick={reset} style={{ padding: "0.75rem 1rem", borderRadius: 10, cursor: "pointer" }}>
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
