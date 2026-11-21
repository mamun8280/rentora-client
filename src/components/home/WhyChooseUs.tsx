"use client";

import { motion } from "framer-motion";
import {
  Wallet,
  ShieldCheck,
  CalendarClock,
  LockKeyhole,
  CheckCircle2,
} from "lucide-react";

const benefits = [
  {
    icon: Wallet,
    title: "Affordable Rental Prices",
    description:
      "Get the equipment you need at budget-friendly prices without the high cost of ownership.",
  },
  {
    icon: ShieldCheck,
    title: "Verified Equipment Owners",
    description:
      "Connect with trusted equipment owners and enjoy a more reliable rental experience.",
  },
  {
    icon: CalendarClock,
    title: "Flexible Rental Periods",
    description:
      "Choose rental periods that fit your schedule, whether you need equipment for a day or longer.",
  },
  {
    icon: LockKeyhole,
    title: "Secure Payments",
    description:
      "Enjoy a safer payment experience with a simple and transparent rental process.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="relative overflow-hidden bg-white px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
      {/* Soft background glow */}
      <div className="pointer-events-none absolute -left-32 top-10 h-96 w-96 rounded-full bg-[#F5B82E]/15 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-10 h-96 w-96 rounded-full bg-[#B4651B]/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl">

        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-14 max-w-2xl text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-[#F5B82E]/25 px-4 py-2 text-xs font-bold uppercase tracking-[2px] text-[#7C4A0E]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#B4651B]" />
            Why Rentora
          </span>

          <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-[#3B2314] sm:text-5xl">
            Why Choose{" "}
            <span className="bg-linear-to-r from-[#E6A515] to-[#B4651B] bg-clip-text text-transparent">
              Rentora?
            </span>
          </h2>

          <p className="mt-4 text-sm leading-7 text-[#6B4426]/85 sm:text-base">
            We make equipment rental simple, affordable, and reliable.
            Discover the benefits that make Rentora a smarter choice.
          </p>
        </motion.div>

        {/* Benefits Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;

            return (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.12,
                }}
                whileHover={{ y: -7 }}
                className="group relative overflow-hidden rounded-3xl bg-[#FFF9EA] p-7 ring-1 ring-[#EBDCB5] transition-all duration-300 hover:bg-white hover:shadow-[0_24px_50px_-20px_rgba(59,35,20,0.35)] hover:ring-[#F5B82E]"
              >
                {/* Corner glow */}
                <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-[#F5B82E]/0 blur-2xl transition-all duration-500 group-hover:bg-[#F5B82E]/30" />

                {/* Icon */}
                <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-[#3B2314] text-[#F5B82E] shadow-lg shadow-[#3B2314]/20 transition-all duration-300 group-hover:bg-[#F5B82E] group-hover:text-[#3B2314] group-hover:shadow-[#F5B82E]/40">
                  <Icon size={28} strokeWidth={1.8} />
                </div>

                {/* Title */}
                <h3 className="relative mt-6 text-lg font-extrabold text-[#3B2314]">
                  {benefit.title}
                </h3>

                {/* Description */}
                <p className="relative mt-3 text-sm leading-7 text-[#6B4426]/85">
                  {benefit.description}
                </p>

                {/* Bottom Indicator */}
                <div className="relative mt-5 flex items-center gap-2 border-t border-[#F0E3BF] pt-4 text-xs font-bold text-[#B4651B]">
                  <CheckCircle2 size={15} />
                  Rent with Confidence
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative mt-12 overflow-hidden rounded-3xl bg-[#3B2314] px-6 py-10 text-center shadow-xl shadow-[#3B2314]/15 sm:px-10"
        >
          <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[#F5B82E]/20 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-20 left-20 h-56 w-56 rounded-full bg-[#B4651B]/30 blur-3xl" />

          <h3 className="relative text-xl font-extrabold text-[#FFF3CF] sm:text-3xl">
            Your Equipment Rental Journey{" "}
            <span className="text-[#F5B82E]">Starts Here</span>
          </h3>

          <p className="relative mx-auto mt-3 max-w-2xl text-sm leading-7 text-[#FDE9A8]/80">
            Save money, find the right equipment, and make every
            project easier with Rentora.
          </p>
        </motion.div>
      </div>
    </section>
  );
}