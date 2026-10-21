import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container max-w-2xl py-24 text-center">
      <h1 className="text-display-lg">Page not found</h1>
      <p className="mt-4 text-muted">The page you are looking for does not exist or has moved.</p>
      <Link href="/" className="btn-primary mt-8">
        Back to all tools
      </Link>
    </div>
  );
}
