
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
    <section className="bg-[#FFF9EA] px-5 py-20 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">

        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-12 max-w-2xl text-center"
        >
          <span className="inline-block rounded-full bg-[#F5B82E]/20 px-4 py-2 text-xs font-bold uppercase tracking-[2px] text-[#8A5A12]">
            Explore Categories
          </span>

          <h2 className="mt-5 text-3xl font-extrabold text-[#3B2314] sm:text-4xl">
            Explore Equipment by{" "}
            <span className="text-[#D99A13]">Category</span>
          </h2>

          <p className="mt-4 text-sm leading-7 text-[#80654B] sm:text-base">
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
                  className="group flex h-full min-h-[230px] flex-col rounded-2xl border border-[#E9D9B9] bg-white p-7 shadow-sm transition-all duration-300 hover:border-[#F5B82E] hover:shadow-xl"
                >
                  {/* Icon */}
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FFF3CF] text-[#9A6710] transition-all duration-300 group-hover:bg-[#F5B82E] group-hover:text-[#3B2314]">
                    <Icon size={29} strokeWidth={1.8} />
                  </div>

                  {/* Category Info */}
                  <h3 className="mt-6 text-lg font-bold text-[#3B2314] transition-colors group-hover:text-[#B47A0B]">
                    {category.name}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-[#80654B]">
                    {category.description}
                  </p>

                  {/* Explore Link */}
                  <div className="mt-auto flex items-center gap-2 pt-5 text-sm font-bold text-[#A36D0A]">
                    Explore Category
                    <ArrowUpRight
                      size={17}
                      className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                    />
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
