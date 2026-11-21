"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  HardHat,
  Camera,
  Truck,
  Sprout,
  Laptop,
  PartyPopper,
  ArrowUpRight,
} from "lucide-react";

const categories = [
  {
    name: "Construction Equipment",
    description: "Tools and machinery for every construction project.",
    icon: HardHat,
  },
  {
    name: "Photography Equipment",
    description: "Cameras and gear to capture every moment.",
    icon: Camera,
  },
  {
    name: "Vehicles & Transportation",
    description: "Find reliable vehicles for your transportation needs.",
    icon: Truck,
  },
  {
    name: "Agriculture Equipment",
    description: "Modern tools for farming and agriculture.",
    icon: Sprout,
  },
  {
    name: "Electronics",
    description: "Explore useful electronic devices and equipment.",
    icon: Laptop,
  },
  {
    name: "Event Equipment",
    description: "Everything you need to make events successful.",
    icon: PartyPopper,
  },
];

export default function CategoriesSection() {
  return (
    <section className="relative overflow-hidden bg-[#FFF9EA] px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
      {/* Soft background glow */}
      <div className="pointer-events-none absolute -right-32 top-10 h-96 w-96 rounded-full bg-[#F5B82E]/20 blur-3xl" />
      <div className="pointer-events-none absolute -left-32 bottom-10 h-96 w-96 rounded-full bg-[#B4651B]/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl">

        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-12 max-w-2xl text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-[#F5B82E]/25 px-4 py-2 text-xs font-bold uppercase tracking-[2px] text-[#7C4A0E]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#B4651B]" />
            Explore Categories
          </span>

          <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-[#3B2314] sm:text-5xl">
            Explore Equipment by{" "}
            <span className="bg-linear-to-r from-[#E6A515] to-[#B4651B] bg-clip-text text-transparent">
              Category
            </span>
          </h2>

          <p className="mt-4 text-sm leading-7 text-[#6B4426]/85 sm:text-base">
            Find the right equipment for your work, projects, and
            everyday needs from our popular rental categories.
          </p>
        </motion.div>

        {/* Category Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category, index) => {
            const Icon = category.icon;

            return (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                }}
                whileHover={{ y: -7 }}
              >
                <Link
                  href="/all-equipment"
                  className="group relative flex h-full min-h-57.5 flex-col overflow-hidden rounded-3xl bg-white p-7 shadow-[0_14px_40px_-24px_rgba(59,35,20,0.35)] ring-1 ring-[#EBDCB5] transition-all duration-300 hover:shadow-[0_24px_50px_-20px_rgba(59,35,20,0.4)] hover:ring-[#F5B82E] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#F5B82E]/50"
                >
                  {/* Corner glow */}
                  <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[#F5B82E]/0 blur-2xl transition-all duration-500 group-hover:bg-[#F5B82E]/30" />

                  {/* Icon */}
                  <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-[#3B2314] text-[#F5B82E] shadow-lg shadow-[#3B2314]/20 transition-all duration-300 group-hover:bg-[#F5B82E] group-hover:text-[#3B2314] group-hover:shadow-[#F5B82E]/40">
                    <Icon size={29} strokeWidth={1.8} />
                  </div>

                  {/* Category Info */}
                  <h3 className="relative mt-6 text-lg font-extrabold text-[#3B2314] transition-colors group-hover:text-[#B4651B]">
                    {category.name}
                  </h3>

                  <p className="relative mt-2 text-sm leading-6 text-[#6B4426]/85">
                    {category.description}
                  </p>

                  {/* Explore Link */}
                  <div className="relative mt-auto flex items-center justify-between border-t border-[#F0E3BF] pt-4 text-sm font-bold text-[#B4651B]">
                    <span>Explore Category</span>
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FFF3CF] text-[#7C4A0E] transition-all duration-300 group-hover:bg-[#3B2314] group-hover:text-[#F5B82E]">
                      <ArrowUpRight
                        size={17}
                        className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      />
                    </span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}