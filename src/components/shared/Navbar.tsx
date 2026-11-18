"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, ArrowUpRight } from "lucide-react";

type NavLink = {
  name: string;
  href: string;
};

const navLinks: NavLink[] = [
  { name: "Home", href: "/" },
  { name: "All Equipment", href: "/all-equipment" },
  { name: "About Us", href: "/about" },
  { name: "Contact Us", href: "/contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [scrolled, setScrolled] = useState<boolean>(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string): boolean =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 w-full px-3  sm:px-6">
      <nav
        className={`flex mx-auto max-w-7xl  items-center justify-between rounded-full border px-3 py-2 backdrop-blur-xl transition-all duration-300 sm:px-4 ${
          scrolled
            ? "border-white bg-white/85 shadow-[0_18px_45px_-18px_rgba(58,33,20,0.4)]"
            : "border-white/70 bg-white/60 shadow-[0_10px_30px_-18px_rgba(58,33,20,0.3)]"
        }`}
      >
        {/* Logo + Website Name */}
        <Link
          href="/"
          className="flex items-center gap-2.5 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-[#F5A524]"
        >
          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-white ring-2 ring-[#F5A524]/40">
            <Image
              src="/images/Rentora-logo.jpg"
              alt="Rentora Logo"
              fill
              priority
              sizes="40px"
              className="object-contain"
            />
          </div>
          <span className="text-2xl font-extrabold tracking-tight text-[#2B1810]">
            Rentora<span className="text-[#F5A524]">.</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-1 rounded-full bg-[#FFF1D0]/80 p-1 ring-1 ring-[#F2D9A0]/60 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`relative rounded-full px-4 py-2 text-sm font-semibold outline-none transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-[#F5A524] ${
                isActive(link.href)
                  ? "text-white"
                  : "text-[#6B5446] hover:text-[#2B1810]"
              }`}
            >
              {isActive(link.href) && (
                <motion.span
                  layoutId="nav-pill"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  className="absolute inset-0 rounded-full bg-linear-to-r from-[#3A2114] to-[#5A3420] shadow-md shadow-[#3A2114]/30"
                />
              )}
              <span className="relative z-10">{link.name}</span>
            </Link>
          ))}
        </div>

        {/* Desktop Login & Register */}
        <div className="hidden items-center gap-2 lg:flex">
          <Link
            href="/login"
            className="rounded-full px-5 py-2.5 text-sm font-semibold text-[#5A3420] outline-none transition hover:bg-[#FFE9A8]/70 focus-visible:ring-2 focus-visible:ring-[#F5A524]"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="group inline-flex items-center gap-2 rounded-full bg-linear-to-r from-[#FFD24A] to-[#F5A524] py-2.5 pl-6 pr-4 text-sm font-bold text-[#3A2114] shadow-lg shadow-[#F5A524]/35 outline-none transition duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#F5A524]/45 focus-visible:ring-2 focus-visible:ring-[#3A2114]"
          >
            Register
            <ArrowUpRight
              size={16}
              className="transition-transform duration-300 group-hover:rotate-45"
            />
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-[#FFF1D0] text-[#3A2114] outline-none ring-1 ring-[#F2D9A0] transition hover:bg-[#FFE9A8] focus-visible:ring-2 focus-visible:ring-[#F5A524] lg:hidden"
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto mt-2 max-w-7xl overflow-hidden rounded-3xl border border-white bg-white/90 p-3 shadow-[0_30px_60px_-25px_rgba(58,33,20,0.5)] backdrop-blur-xl lg:hidden"
          >
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                    isActive(link.href)
                      ? "bg-linear-to-r from-[#3A2114] to-[#5A3420] text-white shadow-md shadow-[#3A2114]/25"
                      : "text-[#5A3E2B] hover:bg-[#FFF1D0]"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            <div className="mt-3 flex gap-3 border-t border-[#F2D9A0]/60 pt-3">
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="flex-1 rounded-full border border-[#5A3420]/30 px-4 py-3 text-center text-sm font-semibold text-[#5A3420] transition hover:bg-[#FFF1D0]"
              >
                Login
              </Link>
              <Link
                href="/register"
                onClick={() => setIsOpen(false)}
                className="flex-1 rounded-full bg-linear-to-r from-[#FFD24A] to-[#F5A524] px-4 py-3 text-center text-sm font-bold text-[#3A2114] shadow-md shadow-[#F5A524]/30 transition hover:shadow-lg"
              >
                Register
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}