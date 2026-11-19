"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="relative flex min-h-[75vh] flex-col items-center justify-center overflow-hidden bg-[#FFF9EA] px-4 text-center">
      {/* Soft background glow */}
      <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[#F5B82E]/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-[#B4651B]/15 blur-3xl" />

      <div className="relative flex w-full max-w-lg flex-col items-center rounded-3xl bg-white/80 p-8 shadow-xl shadow-[#3B2314]/10 ring-1 ring-[#EBDCB5] backdrop-blur sm:p-12">
        <div className="relative">
          <div className="absolute inset-0 -m-3 rounded-full bg-[#F5B82E]/30 blur-xl" />
          <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl bg-[#3B2314] shadow-lg shadow-[#3B2314]/25">
            <AlertTriangle size={44} className="text-[#F5B82E]" />
          </div>
        </div>

        <h1 className="mt-7 text-3xl font-extrabold tracking-tight text-[#3B2314]">
          Something went wrong!
        </h1>

        <p className="mt-3 max-w-sm text-sm leading-7 text-[#6B4426]/85">
          Sorry, something unexpected happened. Please try again.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => reset()}
            className="inline-flex items-center gap-2 rounded-xl bg-[#F5B82E] px-6 py-3 text-sm font-extrabold text-[#3B2314] shadow-md shadow-[#F5B82E]/30 transition hover:bg-[#E6A515] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#3B2314]/30"
          >
            <RefreshCw size={17} />
            Try Again
          </button>

          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl bg-[#3B2314] px-6 py-3 text-sm font-bold text-[#FDE9A8] transition hover:bg-[#2A180D] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#3B2314]/30"
          >
            <Home size={17} />
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}