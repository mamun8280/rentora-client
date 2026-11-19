import Link from "next/link";
import { Home, SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <div className="relative flex min-h-[75vh] flex-col items-center justify-center overflow-hidden bg-[#FFF9EA] px-4 text-center">
      {/* Soft background glow */}
      <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[#F5B82E]/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-[#B4651B]/15 blur-3xl" />

      <div className="relative flex w-full max-w-lg flex-col items-center rounded-3xl bg-white/80 p-8 shadow-xl shadow-[#3B2314]/10 ring-1 ring-[#EBDCB5] backdrop-blur sm:p-12">
        <div className="relative">
          <div className="absolute inset-0 -m-3 rounded-full bg-[#F5B82E]/30 blur-xl" />
          <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl bg-[#3B2314] shadow-lg shadow-[#3B2314]/25">
            <SearchX size={44} className="text-[#F5B82E]" />
          </div>
        </div>

        <h1 className="mt-7 bg-linear-to-b from-[#F5B82E] to-[#B4651B] bg-clip-text text-8xl font-black leading-none tracking-tight text-transparent">
          404
        </h1>

        <h2 className="mt-4 text-2xl font-extrabold text-[#3B2314]">
          Page not found!
        </h2>

        <p className="mt-3 max-w-sm text-sm leading-7 text-[#6B4426]/85">
          Sorry, the page you are looking for does not exist or has been moved.
        </p>

        <Link
          href="/"
          className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#F5B82E] px-7 py-3 text-sm font-extrabold text-[#3B2314] shadow-md shadow-[#F5B82E]/30 transition hover:bg-[#E6A515] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#3B2314]/30"
        >
          <Home size={17} />
          Back to Home
        </Link>
      </div>
    </div>
  );
}