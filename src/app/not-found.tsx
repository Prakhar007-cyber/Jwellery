import Link from "next/link";

// Global 404 page.
export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-ivory px-6 text-center">
      <span className="eyebrow text-gold">Error 404</span>
      <h1 className="display mt-6 text-7xl lg:text-9xl">Lost its sparkle.</h1>
      <p className="mt-4 max-w-md text-espresso-soft">
        The page you are looking for could not be found. Let us guide you back to the collection.
      </p>
      <Link href="/" className="mt-10 bg-espresso px-10 py-4">
        <span className="eyebrow text-ivory">Return Home</span>
      </Link>
    </div>
  );
}
