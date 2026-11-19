import { Heart, Search } from "lucide-react";
import Link from "next/link";

export default function FavoritesPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <p className="inline-flex items-center gap-2 rounded-full bg-[#F5B82E]/25 px-3 py-1 text-xs font-bold text-[#7C4A0E]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#B4651B]" />
          Customer dashboard
        </p>

        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-[#3B2314] sm:text-4xl">
          My Favorites
        </h1>

        <p className="mt-2 text-sm text-[#6B4426]/80">
          Keep your favorite equipment in one place.
        </p>
      </div>

      {/* Saved equipment */}
      <div className="overflow-hidden rounded-3xl bg-white shadow-xl shadow-[#3B2314]/5 ring-1 ring-[#EBDCB5]">
        <div className="flex items-center gap-3 border-b border-[#F0E3BF] px-5 py-4 sm:px-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#3B2314] text-[#F5B82E]">
            <Heart size={20} />
          </div>
          <h2 className="text-lg font-extrabold text-[#3B2314]">
            Saved equipment
          </h2>
        </div>

        {/* Empty state */}
        <div className="flex flex-col items-center px-4 py-20 text-center">
          <div className="relative mb-5">
            <div className="absolute inset-0 -m-3 rounded-full bg-[#F5B82E]/25 blur-xl" />
            <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl bg-[#FDE9A8] text-[#B4651B]">
              <Heart size={42} />
            </div>
          </div>

          <p className="text-lg font-extrabold text-[#3B2314]">
            No favorites yet
          </p>

          <p className="mt-2 max-w-sm text-sm text-[#6B4426]/80">
            Equipment you save will appear here.
          </p>

          <Link
            href="/all-equipment"
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#F5B82E] px-6 py-3 text-sm font-extrabold text-[#3B2314] shadow-md shadow-[#F5B82E]/30 transition hover:bg-[#E6A515] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#3B2314]/30"
          >
            <Search size={17} />
            Explore Equipment
          </Link>
        </div>
      </div>
    </div>
  );
}