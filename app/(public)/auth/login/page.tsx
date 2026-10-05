// src/app/auth/login/page.tsx
"use client";

import { Suspense } from "react";
import LoginForm from "../components/loginForm"; // Adjust path if your loginForm path differs slightly

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[#080C0A] flex items-center justify-center">
      <Suspense
        fallback={
          <div className="text-white text-xs tracking-wide">
            Loading login...
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </main>
  );
}
