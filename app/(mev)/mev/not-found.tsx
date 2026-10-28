import Link from "next/link";

export default function NotFound() {
  return (
    <main className="nf">
      <div className="wrap">
        <div className="eyebrow">404 — Below the Planck scale</div>
        <h1 className="mt-6">Not in the handbook.</h1>
        <p className="mt-6 mb-8 text-soft">This page is smaller than anything we can measure.</p>
        <Link href="/mev" className="btn solid">
          Back to the handbook
        </Link>
      </div>
    </main>
  );
}
