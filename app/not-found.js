import Link from "next/link";
export default function NotFound() {
  return (
    <main className="container flex min-h-screen flex-col items-start justify-center gap-5">
      <p className="eyebrow">Serendib Condos · 404</p>
      <h1>Page not found.</h1>
      <p>Return to the collection to continue exploring.</p>
      <Link className="button" href="/">
        Back to home ↗
      </Link>
    </main>
  );
}
