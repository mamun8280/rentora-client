
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  MapPin,
  Package,
  CalendarDays,
  User,
  Tag,
  ShieldCheck,
  Loader2,
  Mail,
  ScrollText,
  Heart,
  CalendarCheck,
  SearchX,
  Check,
} from "lucide-react";
import { toast } from "sonner";

import BookingModal from "@/components/equipment/BookingModal";
import { authClient } from "@/lib/auth-client";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface Equipment {
  _id: string;
  equipmentName: string;
  description: string;
  category: string;
  rentalPrice: number;
  rentalType: string;
  location: string;
  availableQuantity: number;
  image: string;
  ownerName: string;
  ownerEmail: string;
  condition?: string;
  brand?: string;
  model?: string;
  availableFrom?: string;
  availableUntil?: string;
  rentalTerms?: string;
}

interface Favorite {
  equipmentId: string;
}

export default function EquipmentDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const id = params.id as string;

  const { data: session } = authClient.useSession();

  const [equipment, setEquipment] = useState<Equipment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [favoriteChecking, setFavoriteChecking] = useState(true);
  const [favoriteAdded, setFavoriteAdded] = useState(false);

  const isFavoriteChecking = Boolean(
    session?.user?.email && equipment?._id && favoriteChecking
  );

  // Check Favorite Status from MongoDB
  useEffect(() => {
    const email = session?.user?.email;

    if (!email || !equipment?._id) {
      return;
    }

    let cancelled = false;

    const checkFavorite = async () => {
      try {
        await Promise.resolve();

        if (cancelled) return;

        setFavoriteChecking(true);

        // Get JWT Token
        const { data, error } = await authClient.token();

        if (error || !data?.token) {
          throw new Error("Authentication token not found.");
        }

        const response = await fetch(
          `${API_URL}/api/favorites/${encodeURIComponent(email)}`,
          {
            headers: {
              Authorization: `Bearer ${data.token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to check favorite status");
        }

        const responseData = await response.json();

        const alreadyAdded = (responseData.favorites || []).some(
          (favorite: Favorite) =>
            String(favorite.equipmentId) === String(equipment._id)
        );

        if (!cancelled) {
          setFavoriteAdded(alreadyAdded);
        }
      } catch (error) {
        console.error("Favorite check failed:", error);
      } finally {
        if (!cancelled) {
          setFavoriteChecking(false);
        }
      }
    };

    checkFavorite();

    return () => {
      cancelled = true;
    };
  }, [equipment?._id, session?.user?.email]);

  // Add Favorite
  const handleAddFavorite = async () => {
    if (!session?.user) {
      router.push(`/login?callbackURL=/equipment/${id}`);
      return;
    }

    if (!equipment || favoriteAdded || favoriteLoading) return;

    try {
      setFavoriteLoading(true);

      // Get JWT Token
      const { data, error } = await authClient.token();

      if (error || !data?.token) {
        throw new Error("Authentication token not found. Please login again.");
      }

      const response = await fetch(`${API_URL}/api/favorites`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${data.token}`,
        },
        body: JSON.stringify({
          customerName: session.user.name,
          customerEmail: session.user.email,
          equipmentId: equipment._id,
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(
          responseData.message || "Failed to add favorite"
        );
      }

      // Already exists in MongoDB
      if (!responseData.success) {
        setFavoriteAdded(true);
        toast.info("This equipment is already in your favorites.");
        return;
      }

      setFavoriteAdded(true);
      toast.success("Added to favorites successfully!");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
    } finally {
      setFavoriteLoading(false);
    }
  };

  // Fetch Equipment
  useEffect(() => {
    if (!id) return;

    let cancelled = false;

    const fetchEquipment = async () => {
      try {
        setLoading(true);

        // Get JWT Token
        const { data, error } = await authClient.token();

        if (error || !data?.token) {
          throw new Error("Authentication token not found. Please login again.");
        }

        const response = await fetch(`${API_URL}/api/equipment/${id}`, {
          headers: {
            Authorization: `Bearer ${data.token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Equipment not found");
        }

        const responseData = await response.json();

        if (!responseData) {
          throw new Error("Equipment not found");
        }

        if (!cancelled) {
          setEquipment(responseData);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Something went wrong"
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchEquipment();

    return () => {
      cancelled = true;
    };
  }, [id]);

  /* ---------- Loading ---------- */
  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-[#FFF9EA]">
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#3B2314] shadow-lg shadow-[#3B2314]/20">
            <Loader2 className="h-8 w-8 animate-spin text-[#F5B82E]" />
          </div>

          <p className="text-sm font-medium text-[#6B4426]">
            Loading equipment...
          </p>
        </div>
      </div>
    );
  }

  /* ---------- Error / Not found ---------- */
  if (error || !equipment) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center bg-[#FFF9EA] px-4 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-[#FDE9A8] text-[#3B2314]">
          <SearchX size={36} />
        </div>

        <h2 className="mt-5 text-2xl font-extrabold text-[#3B2314]">
          Equipment not found
        </h2>

        <p className="mt-2 max-w-sm text-sm text-[#6B4426]/80">
          {error || "This equipment is not available."}
        </p>

        <Link
          href="/all-equipment"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#F5B82E] px-6 py-3 text-sm font-extrabold text-[#3B2314] shadow-md shadow-[#F5B82E]/30 transition hover:bg-[#E6A515]"
        >
          Browse Equipment
        </Link>
      </div>
    );
  }

  const isAvailable = equipment.availableQuantity > 0;

  const formatDate = (value: string) =>
    new Date(value).toLocaleDateString();

  const infoItems = [
    {
      label: "Location",
      value: equipment.location,
      icon: MapPin,
    },
    {
      label: "Available quantity",
      value: String(equipment.availableQuantity),
      icon: Package,
    },
    equipment.condition && {
      label: "Condition",
      value: equipment.condition,
      icon: ShieldCheck,
    },
    equipment.brand && {
      label: "Brand",
      value: `${equipment.brand}${equipment.model ? ` - ${equipment.model}` : ""}`,
      icon: Tag,
    },
    equipment.availableFrom && {
      label: "Available from",
      value: formatDate(equipment.availableFrom),
      icon: CalendarDays,
    },
    equipment.availableUntil && {
      label: "Available until",
      value: formatDate(equipment.availableUntil),
      icon: CalendarCheck,
    },
  ].filter(Boolean) as {
    label: string;
    value: string;
    icon: typeof MapPin;
  }[];

  return (
    <main className="min-h-screen bg-[#FFF9EA] bg-[radial-gradient(ellipse_at_top_right,#FDE9A8_0%,transparent_45%)] px-4 py-10">
      <div className="mx-auto max-w-6xl">

        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="group mb-6 inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-sm font-semibold text-[#6B4426] ring-1 ring-[#E8D5A8] backdrop-blur transition hover:bg-white hover:text-[#3B2314]"
        >
          <ArrowLeft
            size={17}
            className="transition group-hover:-translate-x-0.5"
          />
          Back
        </button>

        {/* Equipment details */}
        <div className="overflow-hidden rounded-[28px] bg-white shadow-xl shadow-[#3B2314]/10 ring-1 ring-[#EBDCB5">
          <div className="grid lg:grid-cols-[1.05fr_1fr]">

            {/* Image */}
            <div className="relative min-h-80 bg-[#FDE9A8] lg:min-h-140">
              {equipment.image ? (
                <Image
                  src={equipment.image}
                  alt={equipment.equipmentName}
                  fill
                  unoptimized
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 55vw"
                />
              ) : (
                <div className="flex h-full min-h-80 flex-col items-center justify-center gap-2 text-[#B4651B]">
                  <Package size={48} />
                  <span className="text-sm font-semibold">
                    No image available
                  </span>
                </div>
              )}

              <div className="absolute inset-0 bg-linear-to-t from-[#3B2314]/45 via-transparent to-transparent" />

              <span className="absolute left-5 top-5 rounded-full bg-[#F5B82E] px-4 py-1.5 text-sm font-bold text-[#3B2314] shadow-md">
                {equipment.category}
              </span>

              <span
                className={`absolute right-5 top-5 inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-bold shadow-md ${
                  isAvailable
                    ? "bg-[#ECF6D8] text-[#3F6212]"
                    : "bg-[#FDE4DC] text-[#9A3412]"
                }`}
              >
                <span
                  className={`h-2 w-2 rounded-full ${
                    isAvailable ? "bg-[#65A30D]" : "bg-[#DC4A1F]"
                  }`}
                />
                {isAvailable ? "Available" : "Unavailable"}
              </span>
            </div>

            {/* Information */}
            <div className="flex flex-col p-6 sm:p-9">
              <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-[#3B2314] sm:text-4xl">
                {equipment.equipmentName}
              </h1>

              <p className="mt-4 whitespace-pre-line leading-7 text-[#6B4426]/90">
                {equipment.description}
              </p>

              {/* Price */}
              <div className="my-6 rounded-2xl bg-[#3B2314] p-5">
                <p className="text-xs font-medium text-[#FDE9A8]/70">
                  Rental price
                </p>

                <p className="mt-1 text-4xl font-extrabold text-[#F5B82E]">
                  ৳{equipment.rentalPrice}
                  <span className="ml-2 text-base font-medium text-[#FDE9A8]/80">
                    / {equipment.rentalType}
                  </span>
                </p>
              </div>

              {/* Basic information */}
              <div className="grid gap-3 sm:grid-cols-2">
                {infoItems.map(({ label, value, icon: Icon }) => (
                  <div
                    key={label}
                    className="flex items-center gap-3 rounded-2xl bg-[#FFF3CF] p-3.5"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#B4651B] shadow-sm">
                      <Icon size={19} />
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs text-[#6B4426]/70">
                        {label}
                      </p>

                      <p className="truncate text-sm font-bold text-[#3B2314]">
                        {value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Owner information */}
              <div className="mt-6 rounded-2xl border border-[#EFE1BD] p-4">
                <h3 className="mb-3 text-sm font-extrabold text-[#3B2314]">
                  Equipment owner
                </h3>

                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#F5B82E] text-[#3B2314]">
                    <User size={22} />
                  </div>

                  <div className="min-w-0">
                    <p className="font-bold text-[#3B2314]">
                      {equipment.ownerName}
                    </p>

                    <p className="flex items-center gap-1.5 break-all text-sm text-[#6B4426]/75">
                      <Mail size={14} className="shrink-0" />
                      {equipment.ownerEmail}
                    </p>
                  </div>
                </div>
              </div>

              {/* Rental terms */}
              {equipment.rentalTerms && (
                <div className="mt-5">
                  <h3 className="flex items-center gap-2 text-sm font-extrabold text-[#3B2314]">
                    <ScrollText size={17} className="text-[#B4651B" />
                    Rental terms
                  </h3>

                  <p className="mt-2 whitespace-pre-line text-sm leading-6 text-[#6B4426]/90">
                    {equipment.rentalTerms}
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="mt-8 grid grid-cols-2 gap-3">
                <BookingModal
                  equipmentId={equipment._id}
                  equipmentName={equipment.equipmentName}
                  rentalPrice={equipment.rentalPrice}
                  rentalType={equipment.rentalType}
                  availableQuantity={equipment.availableQuantity}
                />

                {/* Add Favorite Button */}
                <button
                  onClick={handleAddFavorite}
                  disabled={
                    favoriteLoading ||
                    isFavoriteChecking ||
                    favoriteAdded
                  }
                  className={`inline-flex items-center justify-center gap-2 rounded-xl border-2 border-[#3B2314] px-4 py-3.5 font-extrabold transition disabled:cursor-not-allowed ${
                    favoriteAdded
                      ? "bg-[#3B2314] text-[#FDE9A8]"
                      : "text-[#3B2314] hover:bg-[#3B2314] hover:text-[#FDE9A8]"
                  }`}
                >
                  {favoriteLoading || isFavoriteChecking ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : favoriteAdded ? (
                    <Check size={18} />
                  ) : (
                    <Heart size={18} />
                  )}

                  {isFavoriteChecking
                    ? "Checking..."
                    : favoriteLoading
                      ? "Adding..."
                      : favoriteAdded
                        ? "Already Added"
                        : "Add Favorite"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}