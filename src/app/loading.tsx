import { LoaderCircle } from "lucide-react";

export default function Loading() {
  return (
    <div className="relative flex min-h-[70vh] flex-col items-center justify-center overflow-hidden bg-[#FFF9EA] px-4">
      {/* Soft background glow */}
      <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[#F5B82E]/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-[#B4651B]/15 blur-3xl" />

      <div className="relative flex flex-col items-center">
        {/* Spinner */}
        <div className="relative flex h-28 w-28 items-center justify-center">
          <div className="absolute inset-0 rounded-full border-4 border-[#F5B82E]/25" />
          <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-[#F5B82E] border-r-[#B4651B]" />

          <div className="flex h-18 w-18 items-center justify-center rounded-2xl bg-[#3B2314] shadow-lg shadow-[#3B2314]/25">
            <LoaderCircle
              size={34}
              className="animate-spin text-[#F5B82E] animation-duration-[1.8s]"
            />
          </div>
        </div>

        <h2 className="mt-8 text-2xl font-extrabold tracking-tight text-[#3B2314]">
          Loading Rentora...
        </h2>

        <p className="mt-2 max-w-xs text-center text-sm leading-6 text-[#6B4426]/85">
          Please wait while we prepare everything for you.
        </p>

        {/* Bouncing dots */}
        <div className="mt-5 flex items-center gap-2" aria-hidden="true">
          <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-[#F5B82E] [animation-delay:-0.3s]" />
          <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-[#B4651B] [animation-delay:-0.15s]" />
          <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-[#3B2314]" />
        </div>
      </div>
    </div>
  );
}