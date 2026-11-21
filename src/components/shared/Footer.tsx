
import Link from "next/link";
import { FaGithub, FaLinkedin, FaGlobe } from "react-icons/fa";
import {
  Mail,
  MapPin,
  Phone,
  ArrowUpRight,
  Package,
} from "lucide-react";

const quickLinks = [
  { name: "Home", href: "/" },
  { name: "All Equipment", href: "/all-equipment" },
  { name: "About Us", href: "/about" },
  { name: "Contact Us", href: "/contact" },
];

const categories = [
  "Construction Equipment",
  "Photography Equipment",
  "Vehicles & Transportation",
  "Agriculture Equipment",
  "Electronics",
  "Event Equipment",
];

const socialLinks = [
  {
    name: "GitHub",
    href: "https://github.com/mamun8280",
    icon: FaGithub,
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/ma-mun-55188432b",
    icon: FaLinkedin,
  },
  {
    name: "Portfolio",
    href: "https://mamun-portfolio-fawn.vercel.app/",
    icon: FaGlobe,
  },
];

export default function Footer() {
  return (
    <footer className="bg-[#2F2118] text-[#FFF9EA]">
      {/* Main Footer */}
      <div className="mx-auto max-w-7xl px-5 pb-12 pt-16 sm:px-8 lg:px-10">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">

          {/* Brand */}
          <div>
            <Link href="/" className="inline-flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F5B82E] text-[#3B2314]">
                <Package size={27} strokeWidth={2.5} />
              </div>

              <div>
                <h2 className="text-2xl font-extrabold tracking-tight">
                  Rentora<span className="text-[#F5B82E]">.</span>
                </h2>
                <p className="text-[10px] font-semibold tracking-[3px] text-[#E5CFA9]">
                  RENT SMARTER
                </p>
              </div>
            </Link>

            <p className="mt-6 max-w-xs text-sm leading-7 text-[#D6C5B1]">
              Rent the equipment you need, when you need it.
              Rentora connects customers with trusted equipment
              owners for a simple and reliable rental experience.
            </p>

            {/* Social Links */}
            <div className="mt-6 flex items-center gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;

                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.name}
                    title={social.name}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-[#80654B] text-[#F5B82E] transition-all duration-300 hover:-translate-y-1 hover:border-[#F5B82E] hover:bg-[#F5B82E] hover:text-[#3B2314]"
                  >
                    <Icon size={20} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-6 text-lg font-bold text-white">
              Quick Links
            </h3>

            <ul className="space-y-4">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-2 text-sm text-[#D6C5B1] transition hover:text-[#F5B82E]"
                  >
                    <ArrowUpRight
                      size={14}
                      className="text-[#F5B82E] transition group-hover:translate-x-1"
                    />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="mb-6 text-lg font-bold text-white">
              Popular Categories
            </h3>

            <ul className="space-y-4">
              {categories.map((category) => (
                <li key={category}>
                  <Link
                    href="/all-equipment"
                    className="text-sm text-[#D6C5B1] transition hover:text-[#F5B82E]"
                  >
                    {category}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-6 text-lg font-bold text-white">
              Get In Touch
            </h3>

            <p className="mb-6 text-sm leading-6 text-[#D6C5B1]">
              Have questions? We are here to help you find the
              right equipment for your needs.
            </p>

            <ul className="space-y-5">
              <li className="flex items-start gap-3">
                <Mail
                  size={19}
                  className="mt-0.5 shrink-0 text-[#F5B82E]"
                />
                <a
                  href="mailto:support@rentora.com"
                  className="break-all text-sm text-[#D6C5B1] transition hover:text-[#F5B82E]"
                >
                  support@rentora.com
                </a>
              </li>

              <li className="flex items-start gap-3">
                <Phone
                  size={19}
                  className="mt-0.5 shrink-0 text-[#F5B82E]"
                />
                <a
                  href="tel:+8801300000000"
                  className="text-sm text-[#D6C5B1] transition hover:text-[#F5B82E]"
                >
                  +880 1300-000000
                </a>
              </li>

              <li className="flex items-start gap-3">
                <MapPin
                  size={19}
                  className="mt-0.5 shrink-0 text-[#F5B82E]"
                />
                <span className="text-sm text-[#D6C5B1]">
                  Bangladesh
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Explore Equipment CTA */}
        <div className="mt-14 flex flex-col items-center justify-between gap-5 rounded-2xl border border-[#80654B] bg-[#3B2B20] p-6 text-center sm:flex-row sm:text-left">
          <div>
            <h3 className="text-lg font-bold text-white">
              Ready to rent smarter?
            </h3>
            <p className="mt-1 text-sm text-[#D6C5B1]">
              Explore equipment and find exactly what you need.
            </p>
          </div>

          <Link
            href="/all-equipment"
            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-[#F5B82E] px-6 py-3 text-sm font-extrabold text-[#3B2314] transition hover:bg-[#E5A817]"
          >
            Explore Equipment
            <ArrowUpRight size={17} />
          </Link>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-[#80654B]/50">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-5 py-6 text-center sm:flex-row sm:px-8 lg:px-10">
          <p className="text-sm text-[#D6C5B1]">
            © {new Date().getFullYear()}{" "}
            <span className="font-bold text-[#F5B82E]">
              Rentora
            </span>.
            All rights reserved.
          </p>

          <p className="text-xs text-[#BCA990]">
            Rent what you need. Pay for what you use.
          </p>
        </div>
      </div>
    </footer>
  );
}
