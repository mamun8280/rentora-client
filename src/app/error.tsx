
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
    <div className="flex min-h-[75vh] flex-col items-center justify-center bg-[#FFF8E7] px-4 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#FFE9A8]">
        <AlertTriangle size={40} className="text-[#A65A22]" />
      </div>

      <h1 className="mt-6 text-3xl font-extrabold text-[#3A2114]">
        Something Went Wrong!
      </h1>

      <p className="mt-3 max-w-md text-sm leading-7 text-[#7A6250]">
        Sorry, something unexpected happened. Please try again.
      </p>

      <div className="mt-7 flex flex-wrap justify-center gap-3">
        <button
          onClick={() => reset()}
          className="flex items-center gap-2 rounded-full bg-[#5A3420] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#3A2114]"
        >
          <RefreshCw size={17} />
          Try Again
        </button>

        <Link
          href="/"
          className="flex items-center gap-2 rounded-full border border-[#D9B77A] px-6 py-3 text-sm font-bold text-[#5A3420] transition hover:bg-[#FFE9A8]"
        >
          <Home size={17} />
          Go Home
        </Link>
      </div>
    </div>
  );
}
