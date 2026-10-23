"use client";
export default function ErrorPage({ reset }) {
  return (
    <main className="container flex min-h-screen flex-col items-start justify-center gap-5">
      <h1>Something went wrong.</h1>
      <p>Please try loading the page again.</p>
      <button className="button" onClick={reset}>
        Try again
      </button>
      <a href="/">Return home</a>
    </main>
  );
}
