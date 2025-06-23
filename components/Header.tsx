import Link from "next/link";

export default function Header() {
  return (
    <div className="pointer-events-auto absolute top-0 left-0 p-6">
      <Link
        href="/"
        className="text-gray-900 text-base font-medium hover:underline transition-colors"
      >
        David Umoru
      </Link>
    </div>
  );
}
