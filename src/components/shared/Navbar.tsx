
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  Menu,
  X,
  ArrowUpRight,
  LayoutDashboard,
  LogOut,
} from "lucide-react";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";

type NavLink = {
  name: string;
  href: string;
};

const navLinks: NavLink[] = [
  { name: "Home", href: "/" },
  { name: "All Equipment", href: "/all-equipment" },
  { name: "About Us", href: "/about" },
  { name: "Contact Us", href: "/contact" },
  { name: "How It Works", href: "/#how-it-works" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Better Auth Session
  const { data: session, isPending } = authClient.useSession();

  const isLoggedIn = !!session?.user;

  // User Role
  const userRole = session?.user?.role?.toLowerCase();

  // Role-based Dashboard Routing
  const dashboardUrl =
    userRole === "admin"
      ? "/admin-dashboard"
      : userRole === "owner"
        ? "/owner-dashboard"
        : "/customer-dashboard";

  // Role-based Dashboard Label
  const dashboardLabel =
    userRole === "admin"
      ? "Admin Dashboard"
      : userRole === "owner"
        ? "Owner Dashboard"
        : "Customer Dashboard";

  // Scroll Effect
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    onScroll();

    window.addEventListener("scroll", onScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // Active Navigation
  const isActive = (href: string) => {
    if (href.includes("#")) return false;

    return href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(`${href}/`);
  };

  // Logout Handler
  const handleLogout = async () => {
    try {
      await authClient.signOut();

      toast.success("Logged out successfully!");
      setIsOpen(false);

      router.push("/");
      router.refresh();
    } catch {
      toast.error("Logout failed. Please try again.");
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full px-3 sm:px-6">
      <nav
        className={`mx-auto flex h-[60px] max-w-7xl items-center justify-between rounded-full border px-3 backdrop-blur-xl sm:px-4 ${
          scrolled
            ? "border-white bg-white/90 shadow-[0_18px_45px_-18px_rgba(58,33,20,0.4)]"
            : "border-white/70 bg-white/60 shadow-[0_10px_30px_-18px_rgba(58,33,20,0.3)]"
        }`}
      >
        {/* Logo */}
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2.5 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-[#F5A524]"
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
              aria-current={isActive(link.href) ? "page" : undefined}
              className={`relative rounded-full px-3 py-2 text-sm font-semibold outline-none transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-[#F5A524] xl:px-4 ${
                isActive(link.href)
                  ? "text-white"
                  : "text-[#6B5446] hover:text-[#2B1810]"
              }`}
            >
              {isActive(link.href) && (
                <span className="absolute inset-0 rounded-full bg-linear-to-r from-[#3A2114] to-[#5A3420] shadow-md shadow-[#3A2114]/30" />
              )}

              <span className="relative z-10">{link.name}</span>
            </Link>
          ))}
        </div>

        {/* Desktop Authentication */}
        <div className="hidden min-w-[200px] shrink-0 items-center justify-end gap-2 lg:flex">
          {!isPending &&
            (isLoggedIn ? (
              <>
                <Link
                  href={dashboardUrl}
                  className="inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold text-[#5A3420] transition hover:bg-[#FFF1D0]"
                >
                  <LayoutDashboard size={17} />
                  {dashboardLabel}
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="inline-flex items-center gap-2 rounded-full bg-linear-to-r from-[#3A2114] to-[#5A3420] px-5 py-2.5 text-sm font-bold text-white shadow-md transition hover:-translate-y-0.5 hover:shadow-lg"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className={`rounded-full px-4 py-2.5 text-sm font-semibold outline-none transition hover:bg-[#FFE9A8]/70 focus-visible:ring-2 focus-visible:ring-[#F5A524] xl:px-5 ${
                    pathname === "/login"
                      ? "bg-[#FFF1D0] text-[#3A2114]"
                      : "text-[#5A3420]"
                  }`}
                >
                  Login
                </Link>

                <Link
                  href="/register"
                  className="group inline-flex items-center gap-2 rounded-full bg-linear-to-r from-[#FFD24A] to-[#F5A524] py-2.5 pl-5 pr-4 text-sm font-bold text-[#3A2114] shadow-lg shadow-[#F5A524]/35 outline-none transition duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#F5A524]/45 focus-visible:ring-2 focus-visible:ring-[#3A2114] xl:pl-6"
                >
                  Register

                  <ArrowUpRight
                    size={16}
                    className="transition-transform duration-300 group-hover:rotate-45"
                  />
                </Link>
              </>
            ))}
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#FFF1D0] text-[#3A2114] outline-none ring-1 ring-[#F2D9A0] transition hover:bg-[#FFE9A8] focus-visible:ring-2 focus-visible:ring-[#F5A524] lg:hidden"
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
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{
              duration: 0.2,
              ease: "easeOut",
            }}
            className="mx-auto mt-2 max-w-7xl overflow-hidden rounded-3xl border border-white bg-white/95 p-3 shadow-[0_30px_60px_-25px_rgba(58,33,20,0.5)] backdrop-blur-xl lg:hidden"
          >
            {/* Mobile Links */}
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

            {/* Mobile Authentication */}
            <div className="mt-3 flex gap-3 border-t border-[#F2D9A0]/60 pt-3">
              {!isPending &&
                (isLoggedIn ? (
                  <>
                    <Link
                      href={dashboardUrl}
                      onClick={() => setIsOpen(false)}
                      className="flex flex-1 items-center justify-center gap-2 rounded-full border border-[#5A3420]/30 px-3 py-3 text-sm font-semibold text-[#5A3420] transition hover:bg-[#FFF1D0]"
                    >
                      <LayoutDashboard size={17} />
                      {dashboardLabel}
                    </Link>

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex flex-1 items-center justify-center gap-2 rounded-full bg-linear-to-r from-[#3A2114] to-[#5A3420] px-3 py-3 text-sm font-bold text-white"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </>
                ) : (
                  <>
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
                  </>
                ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
