
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Heart,
  Search,
  Loader2,
  Package,
  Eye,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface Favorite {
  _id: string;
  equipmentId: string;
  equipmentName: string;
  category: string;
  image: string;
  ownerName: string;
  ownerEmail: string;
  createdAt: string;
}

export default function FavoritesPage() {
  const { data: session } = authClient.useSession();

  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [removingId, setRemovingId] = useState<string | null>(null);

  // Fetch Favorites from MongoDB
  useEffect(() => {
    const fetchFavorites = async () => {
      const email = session?.user?.email;

      if (!email) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/api/favorites/${encodeURIComponent(email)}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch favorites");
        }

        const data = await response.json();

        setFavorites(data.favorites || []);
      } catch (err) {
        console.error(err);
        setError("Could not load your favorite equipment.");
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [session?.user?.email]);

  // Remove Favorite from MongoDB
  const handleRemoveFavorite = async (id: string) => {
    try {
      setRemovingId(id);

      const response = await fetch(
        `${API_URL}/api/favorites/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to remove favorite");
      }

      // Update frontend list after successful backend deletion
      setFavorites((previous) =>
        previous.filter((favorite) => favorite._id !== id)
      );

      toast.success("Favorite removed successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Could not remove favorite.");
    } finally {
      setRemovingId(null);
    }
  };

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

      {/* Saved Equipment */}
      <div className="overflow-hidden rounded-3xl bg-white shadow-xl shadow-[#3B2314]/5 ring-1 ring-[#EBDCB5]">

        {/* Section Header */}
        <div className="flex items-center gap-3 border-b border-[#F0E3BF] px-5 py-4 sm:px-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#3B2314] text-[#F5B82E]">
            <Heart size={20} />
          </div>

          <div>
            <h2 className="text-lg font-extrabold text-[#3B2314]">
              Saved Equipment
            </h2>

            <p className="text-xs text-[#6B4426]/70">
              {favorites.length} saved equipment
            </p>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center px-4 py-20 text-center">
            <Loader2
              size={36}
              className="animate-spin text-[#B4651B]"
            />

            <p className="mt-4 text-sm font-semibold text-[#6B4426]">
              Loading your favorites...
            </p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="px-4 py-20 text-center">
            <p className="font-semibold text-red-600">
              {error}
            </p>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && favorites.length === 0 && (
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
        )}

        {/* Favorites List */}
        {!loading && !error && favorites.length > 0 && (
          <div className="divide-y divide-[#F0E3BF]">

            {favorites.map((favorite) => (
              <div
                key={favorite._id}
                className="flex flex-col gap-4 px-5 py-5 transition hover:bg-[#FFFCF5] sm:flex-row sm:items-center sm:px-6"
              >
                {/* Equipment Image */}
                <div className="relative h-24 w-full shrink-0 overflow-hidden rounded-xl bg-[#F8F3E7] sm:w-28">
                  {favorite.image ? (
                    <Image
                      src={favorite.image}
                      alt={favorite.equipmentName}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-[#B4651B]">
                      <Package size={32} />
                    </div>
                  )}
                </div>

                {/* Equipment Information */}
                <div className="min-w-0 flex-1">
                  <h3 className="text-base font-extrabold text-[#3B2314]">
                    {favorite.equipmentName}
                  </h3>

                  <span className="mt-2 inline-block rounded-full bg-[#FDE9A8] px-3 py-1 text-xs font-bold text-[#7C4A0E]">
                    {favorite.category}
                  </span>

                  <div className="mt-2">
                    <p className="text-sm font-semibold text-[#6B4426]">
                      Owner: {favorite.ownerName}
                    </p>

                    <p className="break-all text-xs text-[#6B4426]/70">
                      {favorite.ownerEmail}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex shrink-0 items-center gap-3">

                  {/* View Button */}
                  <Link
                    href={`/equipment/${favorite.equipmentId}`}
                    title="View Equipment"
                    aria-label="View Equipment"
                    className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FDE9A8] text-[#7C4A0E] transition hover:bg-[#F5B82E] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#F5B82E]/30"
                  >
                    <Eye size={20} />
                  </Link>

                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={() => handleRemoveFavorite(favorite._id)}
                    disabled={removingId === favorite._id}
                    title="Remove Favorite"
                    aria-label="Remove Favorite"
                    className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {removingId === favorite._id ? (
                      <Loader2
                        size={20}
                        className="animate-spin"
                      />
                    ) : (
                      <Trash2 size={20} />
                    )}
                  </button>

                </div>
              </div>
            ))}

          </div>
        )}
      </div>
    </div>
  );
}
