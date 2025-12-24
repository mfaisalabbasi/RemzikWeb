"use client";

import { useState } from "react";
import Link from "next/link";

export default function GetStartedCTA() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
      >
        Get Started
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 bg-white shadow-lg rounded-lg overflow-hidden z-50">
          {/* Investor */}
          <div className="border-b px-4 py-2">
            <p className="font-semibold text-gray-700 mb-1">Investor</p>
            <div className="flex flex-col gap-2">
              <Link
                href="/login?role=investor"
                className="text-green-600 hover:underline"
              >
                Login
              </Link>
              <Link
                href="/signup?role=investor"
                className="text-green-600 hover:underline"
              >
                Sign Up
              </Link>
            </div>
          </div>

          {/* Partner */}
          <div className="px-4 py-2">
            <p className="font-semibold text-gray-700 mb-1">Partner</p>
            <div className="flex flex-col gap-2">
              <Link
                href="/login?role=partner"
                className="text-green-600 hover:underline"
              >
                Login
              </Link>
              <Link
                href="/signup?role=partner"
                className="text-green-600 hover:underline"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
