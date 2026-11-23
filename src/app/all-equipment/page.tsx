"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  MapPin,
  Package,
  ArrowUpDown,
  RotateCcw,
  ArrowRight,
  Layers,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface Equipment {
  _id: string;
  equipmentName: string;
  description: string;
  category: string;
  location: string;
  rentalPrice: number;
  rentalType: string;
  availableQuantity: number;
  image: string;
  createdAt: string;
}

const categories = [
  "All",
  "Construction Equipment",
  "Agriculture Equipment",
  "Power Tools",
  "Hand Tools",
  "Vehicles",
  "Photography Equipment",
  "Audio & Video Equipment",
  "Event Equipment",
  "Cleaning Equipment",
  "Gardening Equipment",
  "Electronics",
  "Other",
];

const field =
  "w-full rounded-xl border border-[#EADFC8] bg-[#FFFBF0] px-3.5 py-2.5 text-sm text-[#2B1A0E] outline-none transition placeholder:text-[#A89478] focus:border-[#E0A100] focus:bg-white focus:ring-4 focus:ring-[#FFC21A]/25";

const AllEquipmentPage = () => {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [rentalType, setRentalType] = useState("All");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [availability, setAvailability] = useState("All");
  const [sort, setSort] = useState("recent");

  useEffect(() => {
    const controller = new AbortController();

    // small debounce so typing doesn't fire a request on every key
    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        setError("");

        const params = new URLSearchParams();
        if (search.trim()) params.append("search", search.trim());
        if (category !== "All") params.append("category", category);
        if (rentalType !== "All") params.append("rentalType", rentalType);
        if (minPrice) params.append("minPrice", minPrice);
        if (maxPrice) params.append("maxPrice", maxPrice);
        if (availability !== "All") params.append("availability", availability);
        if (sort !== "recent") params.append("sort", sort);

        const response = await fetch(
          `${API_URL}/api/equipment?${params.toString()}`,
          { signal: controller.signal }
        );

        if (!response.ok) throw new Error("Failed to load equipment.");

        const data = await response.json();

        if (data.success) {
          setEquipment(data.equipment || []);
        } else {
          throw new Error(data.message || "Failed to load equipment.");
        }
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
        console.error("Equipment Fetch Error:", err);
        setError("Could not load equipment. Please try again.");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 300);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [search, category, rentalType, minPrice, maxPrice, availability, sort, retry]);

  const resetFilters = () => {
    setSearch("");
    setCategory("All");
    setRentalType("All");
    setMinPrice("");
    setMaxPrice("");
    setAvailability("All");
    setSort("recent");
  };

  const invalidPrice =
    (minPrice !== "" && Number(minPrice) < 0) ||
    (maxPrice !== "" && Number(maxPrice) < 0) ||
    (minPrice !== "" && maxPrice !== "" && Number(minPrice) > Number(maxPrice));

  return (
    <main className="min-h-screen bg-[#FFF9E8]">
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#2B1A0E] px-4 pb-28 pt-16 sm:px-6 lg:px-10">
        <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[#FFC21A]/25 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 left-1/4 h-72 w-72 rounded-full bg-[#E0A100]/15 blur-3xl" />

        <div className="relative mx-auto max-w-7xl">
          <p className="inline-flex items-center gap-2 rounded-full border border-[#FFC21A]/30 bg-[#FFC21A]/10 px-3 py-1 text-sm font-medium text-[#FFD65C]">
            <Layers size={15} />
            Rentora marketplace
          </p>

          <h1 className="mt-5 max-w-2xl text-4xl font-extrabold leading-tight tracking-tight text-[#FFF4D1] sm:text-5xl">
            Rent the equipment,{" "}
            <span className="text-[#FFC21A]">skip the purchase.</span>
          </h1>

          <p className="mt-4 max-w-xl text-base leading-7 text-[#D9C4A0]">
            Browse tools, vehicles and gear from trusted owners near you, and
            book by the day, week or month.
          </p>
        </div>
      </section>

      <div className="mx-auto -mt-16 max-w-7xl px-4 pb-16 sm:px-6 lg:px-10">
        {/* Filters */}
        <div className="rounded-3xl border border-[#EADFC8] bg-white p-5 shadow-[0_20px_50px_-20px_rgba(43,26,14,0.35)] sm:p-6">
          {/* Search */}
          <div className="relative">
            <Search
              size={19}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B8860B]"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by equipment name or location"
              aria-label="Search equipment"
              className="w-full rounded-2xl border border-[#EADFC8] bg-[#FFFBF0] py-3.5 pl-12 pr-4 text-sm text-[#2B1A0E] outline-none transition placeholder:text-[#A89478] focus:border-[#E0A100] focus:bg-white focus:ring-4 focus:ring-[#FFC21A]/25"
            />
          </div>

          {/* Category chips */}
          <div className="-mx-1 mt-4 flex gap-2 overflow-x-auto px-1 pb-2 scrollbar-thin">
            {categories.map((item) => {
              const active = category === item;
              return (
                <button
                  key={item}
                  onClick={() => setCategory(item)}
                  aria-pressed={active}
                  className={`shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium transition ${
                    active
                      ? "border-[#FFC21A] bg-[#FFC21A] text-[#2B1A0E] shadow-sm"
                      : "border-[#EADFC8] bg-white text-[#6B4426] hover:border-[#E0A100] hover:bg-[#FFF4D1]"
                  }`}
                >
                  {item}
                </button>
              );
            })}
          </div>

          {/* Secondary filters */}
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <select
              aria-label="Rental type"
              value={rentalType}
              onChange={(e) => setRentalType(e.target.value)}
              className={field}
            >
              <option value="All">All rental types</option>
              <option value="Daily">Daily</option>
              <option value="Weekly">Weekly</option>
              <option value="Monthly">Monthly</option>
            </select>

            <select
              aria-label="Availability"
              value={availability}
              onChange={(e) => setAvailability(e.target.value)}
              className={field}
            >
              <option value="All">Any availability</option>
              <option value="Available">Available</option>
              <option value="Unavailable">Unavailable</option>
            </select>

            <input
              type="number"
              min="0"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              placeholder="Min price (৳)"
              aria-label="Minimum price"
              className={field}
            />

            <input
              type="number"
              min="0"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="Max price (৳)"
              aria-label="Maximum price"
              className={field}
            />

            <div className="relative">
              <ArrowUpDown
                size={15}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#B8860B]"
              />
              <select
                aria-label="Sort by"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className={`${field} pl-9`}
              >
                <option value="recent">Recently added</option>
                <option value="price-low">Price: low to high</option>
                <option value="price-high">Price: high to low</option>
              </select>
            </div>
          </div>

          {invalidPrice && (
            <p className="mt-3 text-sm font-medium text-red-600">
              Minimum price can&apos;t be higher than maximum price.
            </p>
          )}

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[#F3EAD3] pt-4">
            <p className="text-sm text-[#80664A]">
              <span className="font-bold text-[#2B1A0E]">{equipment.length}</span>{" "}
              {equipment.length === 1 ? "item" : "items"} found
            </p>

            <button
              onClick={resetFilters}
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-[#8A5A13] transition hover:bg-[#FFF4D1]"
            >
              <RotateCcw size={15} />
              Reset filters
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="mt-10">
          {loading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div
                  key={item}
                  className="h-95 animate-pulse rounded-3xl bg-[#F3E7C6]"
                />
              ))}
            </div>
          ) : error ? (
            <div className="rounded-3xl border border-red-200 bg-red-50 p-10 text-center">
              <p className="font-semibold text-red-700">{error}</p>
              <button
                onClick={() => setRetry((n) => n + 1)}
                className="mt-4 rounded-full bg-[#2B1A0E] px-6 py-2.5 text-sm font-semibold text-[#FFF4D1] transition hover:bg-[#4A2E18]"
              >
                Try again
              </button>
            </div>
          ) : equipment.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-[#E0C98A] bg-white px-5 py-16 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#FFF1BF]">
                <Package size={30} className="text-[#B8860B]" />
              </div>
              <h3 className="text-xl font-bold text-[#2B1A0E]">
                No equipment matches your filters
              </h3>
              <p className="mt-2 text-sm text-[#80664A]">
                Try a different search or widen your price range.
              </p>
              <button
                onClick={resetFilters}
                className="mt-6 rounded-full bg-[#FFC21A] px-6 py-3 text-sm font-bold text-[#2B1A0E] transition hover:bg-[#FFD04D]"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {equipment.map((item) => {
                const available = item.availableQuantity > 0;
                return (
                  <article
                    key={item._id}
                    className="group flex flex-col overflow-hidden rounded-3xl border border-[#EADFC8] bg-white transition duration-300 hover:-translate-y-1 hover:border-[#FFC21A] hover:shadow-[0_24px_50px_-24px_rgba(138,90,19,0.55)]"
                  >
                    {/* Image */}
                    <div className="relative h-56 w-full overflow-hidden bg-[#F7EBC9]">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.equipmentName}
                          fill
                          unoptimized
                          className="object-cover transition duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-[#B8860B]/60">
                          <Package size={46} />
                        </div>
                      )}

                      <div className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-[#2B1A0E]/60 to-transparent" />

                      <span className="absolute left-3 top-3 rounded-full bg-[#2B1A0E]/85 px-3 py-1 text-xs font-semibold text-[#FFE69A] backdrop-blur">
                        {item.category}
                      </span>

                      <span
                        className={`absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold backdrop-blur ${
                          available
                            ? "bg-white/90 text-green-700"
                            : "bg-white/90 text-red-600"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            available ? "bg-green-500" : "bg-red-500"
                          }`}
                        />
                        {available ? "Available" : "Unavailable"}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="flex flex-1 flex-col p-5">
                      <h3 className="line-clamp-1 text-xl font-bold text-[#2B1A0E]">
                        {item.equipmentName}
                      </h3>

                      <div className="mt-2 flex items-center gap-1.5 text-sm text-[#80664A]">
                        <MapPin size={15} className="shrink-0 text-[#D49A0A]" />
                        <span className="line-clamp-1">{item.location}</span>
                      </div>

                      <div className="mt-5 flex items-end justify-between rounded-2xl bg-[#FFF6D8] px-4 py-3">
                        <div>
                          <p className="text-xs text-[#8A6A3A]">Rental price</p>
                          <p className="text-2xl font-extrabold text-[#2B1A0E]">
                            ৳{item.rentalPrice}
                            <span className="ml-1 text-xs font-medium text-[#80664A]">
                              / {item.rentalType}
                            </span>
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="text-xs text-[#8A6A3A]">In stock</p>
                          <p className="text-lg font-bold text-[#8A5A13]">
                            {item.availableQuantity}
                          </p>
                        </div>
                      </div>

                      <Link
                        href={`/equipment/${item._id}`}
                        className="mt-5 inline-flex items-center justify-center gap-2 rounded-full bg-[#2B1A0E] px-4 py-3 text-sm font-bold text-[#FFF4D1] transition hover:bg-[#FFC21A] hover:text-[#2B1A0E]"
                      >
                        View details
                        <ArrowRight
                          size={16}
                          className="transition group-hover:translate-x-1"
                        />
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default AllEquipmentPage;