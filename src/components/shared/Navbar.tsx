"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";

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
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string): boolean =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "border-b border-gray-200/70 bg-white/80 shadow-[0_4px_24px_-12px_rgba(36,92,69,0.25)] backdrop-blur-xl"
          : "border-b border-transparent bg-white"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Logo + Website Name */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl ring-1 ring-[#245C45]/15">
            <Image
              src="/images/Rentora-logo.jpg"
              alt="Rentora Logo"
              fill
              priority
              sizes="44px"
              className="object-contain"
            />
          </div>
          <span className="text-2xl font-bold tracking-tight text-[#245C45]">
            Rentora<span className="text-[#D99A48]">.</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-1 rounded-full bg-[#F3F8F4] p-1 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`relative rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                isActive(link.href) ? "text-white" : "text-gray-600 hover:text-[#245C45]"
              }`}
            >
              {isActive(link.href) && (
                <motion.span
                  layoutId="nav-pill"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  className="absolute inset-0 rounded-full bg-[#245C45]"
                />
              )}
              <span className="relative z-10">{link.name}</span>
            </Link>
          ))}
        </div>

        {/* Desktop Login & Register */}
        <div className="hidden items-center gap-3 lg:flex">
          <Link
            href="/login"
            className="rounded-full px-5 py-2.5 text-sm font-semibold text-[#245C45] transition hover:bg-[#DCEBDD]"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="rounded-full bg-[#245C45] px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-[#245C45]/20 transition hover:-translate-y-0.5 hover:bg-[#194832] hover:shadow-lg"
          >
            Register
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-lg p-2 text-[#245C45] transition hover:bg-[#DCEBDD] lg:hidden"
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
        >
          {isOpen ? <X size={25} /> : <Menu size={25} />}
        </button>
      </nav>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-t border-gray-100 bg-white lg:hidden"
          >
            <div className="px-4 pb-5 pt-3">
              <div className="flex flex-col gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`rounded-lg px-3 py-3 text-sm font-medium transition ${
                      isActive(link.href)
                        ? "bg-[#245C45] text-white"
                        : "text-gray-700 hover:bg-[#DCEBDD] hover:text-[#245C45]"
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>

              <div className="mt-4 flex gap-3 border-t border-gray-100 pt-4">
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 rounded-lg border border-[#245C45] px-4 py-2.5 text-center text-sm font-semibold text-[#245C45] transition hover:bg-[#DCEBDD]"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 rounded-lg bg-[#245C45] px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-[#194832]"
                >
                  Register
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}