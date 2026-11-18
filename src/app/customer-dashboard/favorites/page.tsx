
import { Heart, Search } from "lucide-react";
import Link from "next/link";

export default function FavoritesPage() {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-medium text-[#A0805B]">
          CUSTOMER DASHBOARD
        </p>

        <h1 className="mt-2 text-3xl font-bold text-[#5C3D25]">
          My Favorites
        </h1>

        <p className="mt-2 text-sm text-[#A0805B]">
          Keep your favorite equipment in one place.
        </p>
      </div>

      <div className="rounded-2xl border border-[#E8D8B8] bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <Heart className="text-[#8B633E]" size={22} />
          <h2 className="text-xl font-bold text-[#5C3D25]">
            Saved Equipment
          </h2>
        </div>

        <div className="py-16 text-center">
          <Heart
            size={42}
            className="mx-auto text-[#C5A984]"
          />

          <p className="mt-4 font-semibold text-[#5C3D25]">
            No favorites yet
          </p>

          <p className="mt-1 text-sm text-[#A0805B]">
            Equipment you save will appear here.
          </p>

          <Link
            href="/all-equipment"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#8B633E] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#5C3D25]"
          >
            <Search size={17} />
            Explore Equipment
          </Link>
        </div>
      </div>
    </div>
  );
}
