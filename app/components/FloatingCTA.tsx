import Link from "next/link";

export default function FloatingCTA() {
  return (
    <div className="fixed bottom-6 right-6 flex flex-col gap-4 z-50">
      <Link
        href="/login?role=investor"
        className="bg-green-600 text-white px-5 py-3 rounded-full shadow-lg hover:bg-green-700 transition"
      >
        Investor Login
      </Link>
      <Link
        href="/login?role=partner"
        className="border border-green-600 text-green-600 px-5 py-3 rounded-full shadow-lg hover:bg-green-50 transition"
      >
        Partner Login
      </Link>
    </div>
  );
}
