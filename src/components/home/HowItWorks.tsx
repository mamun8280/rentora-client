"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Search,
  CalendarCheck,
  PackageCheck,
  ArrowRight,
} from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Search,
    title: "Find Equipment",
    description:
      "Browse different equipment categories and find the right equipment for your needs.",
  },
  {
    number: "02",
    icon: CalendarCheck,
    title: "Book Your Rental",
    description:
      "Choose your preferred rental period and submit your booking request.",
  },
  {
    number: "03",
    icon: PackageCheck,
    title: "Get Your Equipment",
    description:
      "Complete the rental process and get the equipment you need for your project.",
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="relative overflow-hidden bg-white px-5 py-20 sm:px-8 lg:px-10 lg:py-28"
    >
      {/* Soft background glow */}
      <div className="pointer-events-none absolute -right-32 top-10 h-96 w-96 rounded-full bg-[#F5B82E]/15 blur-3xl" />
      <div className="pointer-events-none absolute -left-32 bottom-10 h-96 w-96 rounded-full bg-[#B4651B]/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-14 max-w-2xl text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-[#F5B82E]/25 px-4 py-2 text-xs font-bold uppercase tracking-[2px] text-[#7C4A0E]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#B4651B]" />
            Simple Process
          </span>

          <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-[#3B2314] sm:text-5xl">
            How{" "}
            <span className="bg-linear-to-r from-[#E6A515] to-[#B4651B] bg-clip-text text-transparent">
              Rentora Works
            </span>
          </h2>

          <p className="mt-4 text-sm leading-7 text-[#6B4426]/85 sm:text-base">
            Renting equipment has never been easier. Follow
            three simple steps to get started.
          </p>
        </motion.div>

        <div className="relative grid gap-8 md:grid-cols-3">
          {/* Connecting line (desktop only) */}
          <div className="pointer-events-none absolute left-[16%] right-[16%] top-18 hidden border-t-2 border-dashed border-[#F5B82E]/60 md:block" />

          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="group relative overflow-hidden rounded-3xl bg-[#FFF9EA] p-8 text-center ring-1 ring-[#EBDCB5] transition-all duration-300 hover:-translate-y-2 hover:bg-white hover:shadow-[0_24px_50px_-20px_rgba(59,35,20,0.35)] hover:ring-[#F5B82E]"
              >
                {/* Corner glow */}
                <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-[#F5B82E]/0 blur-2xl transition-all duration-500 group-hover:bg-[#F5B82E]/30" />

                <span className="absolute right-6 top-5 text-4xl font-black text-[#F0E0B8] transition-colors duration-300 group-hover:text-[#F5B82E]/60">
                  {step.number}
                </span>

                <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#3B2314] text-[#F5B82E] shadow-lg shadow-[#3B2314]/25 ring-4 ring-[#FFF9EA] transition-all duration-300 group-hover:bg-[#F5B82E] group-hover:text-[#3B2314] group-hover:ring-white">
                  <Icon size={30} />
                </div>

                <h3 className="relative mt-6 text-xl font-extrabold text-[#3B2314]">
                  {step.title}
                </h3>

                <p className="relative mt-3 text-sm leading-7 text-[#6B4426]/85">
                  {step.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-12 text-center"
        >
          <Link
            href="/all-equipment"
            className="group inline-flex items-center gap-2 rounded-xl bg-[#F5B82E] px-7 py-3.5 text-sm font-extrabold text-[#3B2314] shadow-md shadow-[#F5B82E]/30 transition hover:bg-[#E6A515] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#3B2314]/30"
          >
            Start Exploring
            <ArrowRight
              size={18}
              className="transition group-hover:translate-x-1"
            />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}