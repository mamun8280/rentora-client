"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, ArrowUpRight, Package, Sparkles, Boxes } from "lucide-react";
import { authClient } from "@/lib/auth-client";

interface Equipment {
  _id: string;
  equipmentName: string;
  category: string;
  rentalPrice: number;
  rentalType: string;
  location: string;
  availableQuantity: number;
  image: string;
}

export default function FeaturedEquipment() {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { data: session } = authClient.useSession();

  useEffect(() => {
    const controller = new AbortController();

    const fetchFeaturedEquipment = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/equipment/featured`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error("Failed to load equipment");
        }

        const data = await response.json();

        if (!data.success) {
          throw new Error("Failed to load equipment");
        }

        setEquipment(data.equipment);
      } catch (err) {
        if (err instanceof Error && err.name !== "AbortError") {
          setError("Unable to load featured equipment.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchFeaturedEquipment();

    return () => controller.abort();
  }, []);

  return (
    <section className="relative overflow-hidden bg-[#FFF9EA] px-6 py-20 lg:py-28">
      {/* Soft background glow */}
      <div className="pointer-events-none absolute -right-32 top-0 h-96 w-96 rounded-full bg-[#F5B82E]/20 blur-3xl" />
      <div className="pointer-events-none absolute -left-32 bottom-0 h-96 w-96 rounded-full bg-[#B4651B]/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl">
        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 flex flex-col justify-between gap-5 sm:flex-row sm:items-end"
        >
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-[#F5B82E]/25 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-[#7C4A0E]">
              <Sparkles size={14} />
              Explore our collection
            </span>

            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-[#3B2314] sm:text-5xl">
              Featured{" "}
              <span className="bg-linear-to-r from-[#E6A515] to-[#B4651B] bg-clip-text text-transparent">
                Equipment
              </span>
            </h2>

            <p className="mt-4 max-w-xl text-base leading-7 text-[#6B4426]/85">
              Discover quality equipment from trusted owners for your next
              project.
            </p>
          </div>

          <Link
            href="/all-equipment"
            className="group inline-flex items-center gap-2 self-start rounded-full bg-[#3B2314] px-6 py-3 text-sm font-bold text-[#FDE9A8] shadow-md shadow-[#3B2314]/15 transition hover:bg-[#2A180D] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#3B2314]/30 sm:self-auto"
          >
            View All Equipment
            <ArrowUpRight
              size={18}
              className="transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </Link>
        </motion.div>

        {/* Loading skeleton */}
        {loading && (
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="animate-pulse overflow-hidden rounded-3xl bg-white ring-1 ring-[#EBDCB5]"
              >
                <div className="h-56 bg-[#F5E7C0]" />
                <div className="space-y-3 p-5">
                  <div className="h-5 w-2/3 rounded-full bg-[#F5E7C0]" />
                  <div className="h-4 w-1/3 rounded-full bg-[#FAF0D4]" />
                  <div className="h-12 rounded-2xl bg-[#FAF0D4]" />
                  <div className="h-11 rounded-full bg-[#F5E7C0]" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="mx-auto max-w-md rounded-2xl bg-[#FDE4DC] px-6 py-5 text-center text-sm font-semibold text-[#9A3412]">
            {error}
          </div>
        )}

        {/* Empty */}
        {!loading && !error && equipment.length === 0 && (
          <div className="flex flex-col items-center py-16 text-center">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-[#FDE9A8] text-[#3B2314]">
              <Package size={34} />
            </div>
            <p className="text-lg font-extrabold text-[#3B2314]">
              No featured equipment yet
            </p>
            <p className="mt-2 text-sm text-[#6B4426]/80">
              No featured equipment available right now.
            </p>
          </div>
        )}

        {/* Equipment cards */}
        {!loading && !error && equipment.length > 0 && (
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {equipment.map((item, index) => {
              const detailsUrl = `/equipment/${item._id}`;

              const viewDetailsUrl = session?.user
                ? detailsUrl
                : `/login?callbackURL=${encodeURIComponent(detailsUrl)}`;

              const isAvailable = item.availableQuantity > 0;

              return (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, y: 35 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group overflow-hidden rounded-3xl bg-white shadow-[0_14px_40px_-22px_rgba(59,35,20,0.35)] ring-1 ring-[#EBDCB5] transition duration-300 hover:-translate-y-2 hover:shadow-[0_24px_50px_-20px_rgba(59,35,20,0.4)] hover:ring-[#F5B82E]"
                >
                  {/* Image */}
                  <div className="relative h-56 overflow-hidden bg-[#FDE9A8]">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.equipmentName}
                        fill
                        unoptimized
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <Package size={45} className="text-[#B4651B]" />
                      </div>
                    )}

                    <div className="absolute inset-0 bg-linear-to-t from-[#3B2314]/50 via-transparent to-transparent" />

                    <span className="absolute left-4 top-4 rounded-full bg-[#F5B82E] px-4 py-1.5 text-xs font-bold text-[#3B2314] shadow-md">
                      {item.category}
                    </span>

                    <span
                      className={`absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold shadow-md ${
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

                    <div className="absolute bottom-4 left-4 right-4 flex items-center gap-2 text-sm font-medium text-white">
                      <MapPin size={16} className="shrink-0 text-[#F5B82E]" />
                      <span className="truncate">{item.location}</span>
                    </div>
                  </div>

                  {/* Information */}
                  <div className="p-5">
                    <h3 className="line-clamp-1 text-xl font-extrabold text-[#3B2314]">
                      {item.equipmentName}
                    </h3>

                    <div className="mt-4 flex items-center justify-between gap-3 rounded-2xl bg-[#FFF3CF] p-4">
                      <div>
                        <p className="text-xs font-medium text-[#6B4426]/75">
                          Rental price
                        </p>

                        <p className="mt-1 text-2xl font-extrabold text-[#B4651B]">
                          ৳{item.rentalPrice}
                          <span className="text-xs font-medium text-[#6B4426]/70">
                            /{item.rentalType}
                          </span>
                        </p>
                      </div>

                      <div className="flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-xs font-bold text-[#3B2314] shadow-sm">
                        <Boxes size={15} className="text-[#B4651B]" />
                        {item.availableQuantity} available
                      </div>
                    </div>

                    <Link
                      href={viewDetailsUrl}
                      className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-[#3B2314] py-3 text-sm font-bold text-[#FDE9A8] transition hover:bg-[#F5B82E] hover:text-[#3B2314] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#F5B82E]/50"
                    >
                      View Details
                      <ArrowUpRight size={17} />
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}