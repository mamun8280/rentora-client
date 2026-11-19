"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Image from "next/image";
import {
  ArrowLeft,
  BadgeCheck,
  Boxes,
  Loader2,
  MapPin,
  Package,
  Pencil,
  ScrollText,
  Tag,
  Trash2,
  Wrench,
} from "lucide-react";

interface Equipment {
  _id: string;
  equipmentName: string;
  image: string;
  description: string;
  category: string;
  location: string;
  rentalPrice: number;
  rentalType: string;
  availableQuantity: number;
  status: string;
  brand?: string;
  model?: string;
  condition?: string;
  rentalTerms?: string;
}

const OwnerDetailsPage = () => {
  const { id } = useParams<{ id: string }>();

  const [equipment, setEquipment] = useState<Equipment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/equipment/${id}`,
        );

        if (!response.ok) {
          throw new Error("Equipment not found");
        }

        const data = await response.json();
        setEquipment(data);
      } catch (error) {
        console.error(error);
        setEquipment(null);
      } finally {
        setLoading(false);
      }
    };

    fetchEquipment();
  }, [id]);

  /* ---------- Loading ---------- */
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FFF9EA]">
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#3B2314] shadow-lg shadow-[#3B2314]/20">
            <Loader2 className="animate-spin text-[#F5B82E]" size={30} />
          </div>
          <p className="text-sm font-medium text-[#6B4426]">
            Loading equipment...
          </p>
        </div>
      </div>
    );
  }

  /* ---------- Not found ---------- */
  if (!equipment) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#FFF9EA] px-4 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-[#FDE9A8]">
          <Package size={38} className="text-[#3B2314]" />
        </div>

        <h2 className="mt-5 text-2xl font-extrabold text-[#3B2314]">
          Equipment not found
        </h2>
        <p className="mt-2 max-w-sm text-sm text-[#6B4426]/80">
          This item may have been removed or the link is incorrect.
        </p>

        <Link
          href="/owner-dashboard/my-equipment"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#3B2314] px-6 py-3 text-sm font-semibold text-[#FDE9A8] transition hover:bg-[#2A180D]"
        >
          <ArrowLeft size={16} />
          Back to My Equipment
        </Link>
      </div>
    );
  }

  const isAvailable = equipment.status?.toLowerCase() === "available";

  const specs = [
    { label: "Brand", value: equipment.brand, icon: Tag },
    { label: "Model", value: equipment.model, icon: Wrench },
    { label: "Condition", value: equipment.condition, icon: BadgeCheck },
  ].filter((s) => s.value);

  return (
    <div className="min-h-screen bg-[#FFF9EA] bg-[radial-gradient(ellipse_at_top_right,#FDE9A8_0%,transparent_45%)] p-4 sm:p-8">
      <div className="mx-auto max-w-6xl">
        {/* Header actions */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/owner-dashboard/my-equipment"
            className="group inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-sm font-semibold text-[#6B4426] ring-1 ring-[#E8D5A8] backdrop-blur transition hover:bg-white hover:text-[#3B2314]"
          >
            <ArrowLeft
              size={17}
              className="transition group-hover:-translate-x-0.5"
            />
            Back to My Equipment
          </Link>

          <div className="flex gap-3">
            {/* Edit Equipment */}
            <Link
              href={`/owner-dashboard/my-equipment/edit?id=${id}`}
              className="inline-flex items-center gap-2 rounded-xl bg-[#F5B82E] px-5 py-2.5 text-sm font-bold text-[#3B2314] shadow-md shadow-[#F5B82E]/30 transition hover:bg-[#E6A515] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3B2314] focus-visible:ring-offset-2"
            >
              <Pencil size={16} />
              Edit
            </Link>

            {/* Delete Equipment */}
            <Link
              href={`/owner-dashboard/my-equipment/delete?id=${id}`}
              className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-[#9A3412] ring-1 ring-[#E8D5A8] transition hover:bg-[#FEF2E8] hover:ring-[#F3B58A] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#9A3412]"
            >
              <Trash2 size={16} />
              Delete
            </Link>
          </div>
        </div>

        {/* Main card */}
        <div className="overflow-hidden rounded-[28px] bg-white shadow-xl shadow-[#3B2314]/10 ring-1 ring-[#EBDCB5]">
          <div className="grid gap-0 lg:grid-cols-[1.05fr_1fr]">
            {/* Image */}
            <div className="relative min-h-80 bg-[#FDE9A8] sm:min-h-115">
              <Image
                src={equipment.image || "/images/equipment-placeholder.png"}
                alt={equipment.equipmentName}
                fill
                unoptimized
                className="object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-[#3B2314]/55 via-transparent to-transparent" />

              <span className="absolute left-5 top-5 rounded-full bg-[#F5B82E] px-4 py-1.5 text-sm font-bold text-[#3B2314] shadow-md">
                {equipment.category}
              </span>

              <div className="absolute bottom-5 left-5 right-5 flex items-center gap-2 text-sm font-medium text-white">
                <MapPin size={17} className="text-[#F5B82E]" />
                <span className="truncate">
                  {equipment.location || "Location not provided"}
                </span>
              </div>
            </div>

            {/* Info */}
            <div className="flex flex-col p-6 sm:p-9">
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold ${
                    isAvailable
                      ? "bg-[#ECF6D8] text-[#3F6212]"
                      : "bg-[#FDE9A8] text-[#7C4A0E]"
                  }`}
                >
                  <span
                    className={`h-2 w-2 rounded-full ${
                      isAvailable ? "bg-[#65A30D]" : "bg-[#E6A515]"
                    }`}
                  />
                  {equipment.status}
                </span>
              </div>

              <h1 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-[#3B2314] sm:text-4xl">
                {equipment.equipmentName}
              </h1>

              {/* Price */}
              <div className="mt-6 rounded-2xl bg-[#3B2314] p-5">
                <p className="text-xs font-medium text-[#FDE9A8]/70">
                  Rental price
                </p>
                <p className="mt-1 text-4xl font-extrabold text-[#F5B82E]">
                  ৳{equipment.rentalPrice}
                  <span className="ml-1 text-base font-medium text-[#FDE9A8]/80">
                    / {equipment.rentalType}
                  </span>
                </p>
              </div>

              {/* Quick stats */}
              <div className="mt-4 flex items-center gap-4 rounded-2xl bg-[#FFF3CF] p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-[#B4651B] shadow-sm">
                  <Boxes size={22} />
                </div>
                <div>
                  <p className="text-xs font-medium text-[#6B4426]/80">
                    Available quantity
                  </p>
                  <p className="text-xl font-extrabold text-[#3B2314]">
                    {equipment.availableQuantity}
                  </p>
                </div>
              </div>

              {/* Specs */}
              {specs.length > 0 && (
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {specs.map(({ label, value, icon: Icon }) => (
                    <div
                      key={label}
                      className="flex items-center gap-3 rounded-2xl border border-[#EFE1BD] p-3.5"
                    >
                      <Icon size={18} className="shrink-0 text-[#B4651B]" />
                      <div className="min-w-0">
                        <p className="text-xs text-[#6B4426]/70">{label}</p>
                        <p className="truncate text-sm font-bold text-[#3B2314]">
                          {value}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Description & terms */}
          <div className="grid gap-8 border-t border-[#F0E3BF] bg-[#FFFCF2] p-6 sm:p-9 lg:grid-cols-2">
            <section>
              <h2 className="flex items-center gap-2 text-lg font-extrabold text-[#3B2314]">
                <span className="h-5 w-1.5 rounded-full bg-[#F5B82E]" />
                Equipment description
              </h2>
              <p className="mt-3 max-w-prose whitespace-pre-line leading-7 text-[#6B4426]">
                {equipment.description || "No description available."}
              </p>
            </section>

            {equipment.rentalTerms && (
              <section>
                <h2 className="flex items-center gap-2 text-lg font-extrabold text-[#3B2314]">
                  <ScrollText size={19} className="text-[#B4651B]" />
                  Rental terms & conditions
                </h2>
                <p className="mt-3 max-w-prose whitespace-pre-line leading-7 text-[#6B4426]">
                  {equipment.rentalTerms}
                </p>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerDetailsPage;
