
import { LoaderCircle } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center bg-[#FFF8E7] px-4">
      <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-[#FFE9A8]">
        <LoaderCircle
          size={42}
          className="animate-spin text-[#8A4B1E]"
        />
      </div>

      <h2 className="mt-6 text-2xl font-bold text-[#3A2114]">
        Loading Rentora...
      </h2>

      <p className="mt-2 text-center text-sm text-[#7A6250]">
        Please wait while we prepare everything for you.
      </p>
    </div>
  );
}
