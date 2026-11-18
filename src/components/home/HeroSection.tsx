"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowUpRight,
  ShieldCheck,
  Clock,
  Truck,
  BadgeCheck,
  CalendarCheck,
  Sparkles,
} from "lucide-react";

const trustPoints = [
  { icon: ShieldCheck, label: "Trusted Owners" },
  { icon: Clock, label: "Flexible Rental" },
  { icon: Truck, label: "Easy Booking" },
];

const HeroSection = () => {
  const reduce = useReducedMotion();

  const fadeUp = (delay = 0) => ({
    initial: reduce ? false : { opacity: 0, y: 28 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] as const },
  });

  return (
    <section className="relative isolate overflow-hidden bg-[#FFF8E7]">
      {/* Warm glow background */}
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="absolute -left-40 -top-40 h-130 w-130 rounded-full bg-[#FFD66B]/55 blur-[110px]" />
        <div className="absolute right-[-10%] top-[10%] h-115 w-115 rounded-full bg-[#F4B860]/40 blur-[120px]" />
        <div className="absolute bottom-[-20%] left-[30%] h-105 w-105 rounded-full bg-[#D9A877]/40 blur-[120px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(74,44,22,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(74,44,22,0.05)_1px,transparent_1px)] bg-size-[56px_56px] mask-[radial-gradient(ellipse_at_center,black_30%,transparent_72%)]" />
      </div>

      <div className="mx-auto grid min-h-175 max-w-7xl items-center gap-16 px-6 py-20 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-28">
        {/* Left */}
        <div className="relative z-10">
          <motion.span
            {...fadeUp(0)}
            className="inline-flex items-center gap-2 rounded-full border border-white bg-white/70 px-4 py-2 text-sm font-semibold text-[#7A4A1C] shadow-[0_8px_30px_-12px_rgba(122,74,28,0.4)] backdrop-blur-xl"
          >
            <Sparkles size={16} className="text-[#F5A524]" />
            Smart Equipment Rental Marketplace
          </motion.span>

          <motion.h1
            {...fadeUp(0.08)}
            className="mt-7 max-w-2xl text-[2.9rem] font-extrabold leading-[1.02] tracking-[-0.035em] text-[#2B1810] sm:text-6xl lg:text-[4.75rem]"
          >
            Rent the right equipment.{" "}
            <span className="bg-linear-to-r from-[#F2A900] via-[#D9822B] to-[#8A4B1E] bg-clip-text text-transparent">
              Get more done.
            </span>
          </motion.h1>

          <motion.p
            {...fadeUp(0.16)}
            className="mt-6 max-w-xl text-base leading-8 text-[#6B5446] sm:text-lg"
          >
            Find and rent quality equipment from trusted owners. Whether you
            need tools for a project or want to earn from your own equipment,
            Rentora makes it simple.
          </motion.p>

          <motion.div {...fadeUp(0.24)} className="mt-10">
            <Link
              href="/all-equipment"
              className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-linear-to-r from-[#3A2114] to-[#5A3420] py-2.5 pl-8 pr-2.5 text-base font-semibold text-white shadow-[0_18px_40px_-12px_rgba(58,33,20,0.65)] outline-none ring-offset-2 transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_22px_50px_-10px_rgba(58,33,20,0.75)] focus-visible:ring-2 focus-visible:ring-[#F5A524]"
            >
              <span
                aria-hidden
                className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-[#FFD66B]/30 to-transparent transition-transform duration-700 group-hover:translate-x-full"
              />
              <span className="relative">Browse All Equipment</span>
              <span className="relative flex h-11 w-11 items-center justify-center rounded-full bg-linear-to-br from-[#FFD24A] to-[#F5A524] text-[#3A2114] transition-transform duration-300 group-hover:rotate-45">
                <ArrowUpRight size={20} />
              </span>
            </Link>
          </motion.div>

          {/* Trust points */}
          <motion.ul {...fadeUp(0.32)} className="mt-12 flex flex-wrap gap-3">
            {trustPoints.map(({ icon: Icon, label }) => (
              <li
                key={label}
                className="flex items-center gap-2.5 rounded-full border border-white bg-white/70 py-2 pl-2 pr-4 text-sm font-semibold text-[#5A3E2B] shadow-[0_8px_24px_-14px_rgba(74,44,22,0.45)] backdrop-blur-xl"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-linear-to-br from-[#FFE9A8] to-[#F7C873] text-[#7A4A1C]">
                  <Icon size={16} />
                </span>
                {label}
              </li>
            ))}
          </motion.ul>
        </div>

        {/* Right */}
        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.94, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto w-full max-w-xl lg:max-w-none"
        >
          {/* Gradient ring behind image */}
          <div
            aria-hidden
            className="absolute -inset-3 rounded-[3rem] bg-linear-to-br from-[#FFD24A] via-[#F2A93B] to-[#A8622B] opacity-85 blur-sm"
          />

          <div className="relative overflow-hidden rounded-[2.75rem] border-[6px] border-white/90 shadow-[0_40px_80px_-30px_rgba(58,33,20,0.55)]">
            <Image
              src="/images/Bannar.jpg"
              alt="Rentora equipment rental"
              width={900}
              height={700}
              priority
              className="h-95 w-full object-cover sm:h-130"
            />
            <div
              aria-hidden
              className="absolute inset-0 bg-linear-to-t from-[#2B1810]/45 via-transparent to-transparent"
            />
          </div>

          {/* Floating: verified */}
          <motion.div
            initial={reduce ? false : { opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="absolute -left-4 top-16 hidden items-center gap-3 rounded-2xl border border-white/80 bg-white/80 p-3 pr-5 shadow-[0_20px_50px_-20px_rgba(58,33,20,0.55)] backdrop-blur-xl sm:flex lg:-left-12"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-linear-to-br from-[#FFD24A] to-[#F5A524] text-[#3A2114] shadow-lg shadow-[#F5A524]/35">
              <BadgeCheck size={22} />
            </span>
            <div>
              <p className="text-sm font-bold text-[#2B1810]">Verified owners</p>
              <p className="text-xs text-[#7D6757]">Checked before listing</p>
            </div>
          </motion.div>

          {/* Floating: booking */}
          <motion.div
            initial={reduce ? false : { opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="absolute -bottom-7 right-3 flex items-center gap-3 rounded-2xl border border-white/80 bg-white/80 p-3 pr-5 shadow-[0_20px_50px_-20px_rgba(58,33,20,0.55)] backdrop-blur-xl sm:right-8 lg:-right-6"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-linear-to-br from-[#8A5230] to-[#4A2A18] text-[#FFE08A] shadow-lg shadow-[#4A2A18]/35">
              <CalendarCheck size={22} />
            </span>
            <div>
              <p className="text-sm font-bold text-[#2B1810]">Book in minutes</p>
              <p className="text-xs text-[#7D6757]">Pick dates, confirm, done</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;