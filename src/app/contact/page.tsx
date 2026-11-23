
import Link from "next/link";
import {
  Mail,
  MapPin,
  Phone,
  ArrowUpRight,
  Clock3,
  MessageCircle,
  Package,
} from "lucide-react";
import { FaGithub, FaLinkedin, FaGlobe } from "react-icons/fa";

const contactDetails = [
  {
    icon: Mail,
    title: "Email Us",
    value: "support@rentora.com",
    href: "mailto:support@rentora.com",
    description: "Send us your questions anytime.",
  },
  {
    icon: Phone,
    title: "Call Us",
    value: "+880 1300-000000",
    href: "tel:+8801300000000",
    description: "Reach out for assistance.",
  },
  {
    icon: MapPin,
    title: "Our Location",
    value: "Bangladesh",
    href: null,
    description: "Serving equipment rental needs.",
  },
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

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#FFFDF8] text-[#2F2118]">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[#2F2118] text-[#FFF9EA]">
        <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[#F5B82E]/10 blur-3xl" />
        <div className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-[#F5B82E]/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 py-20 text-center sm:py-24">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#F5B82E]/30 bg-white/5 px-4 py-2 text-sm font-medium text-[#F5B82E]">
            <MessageCircle size={16} />
            We&apos;re Here to Help
          </span>

          <h1 className="mt-7 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            Get in <span className="text-[#F5B82E]">Touch</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-[#D6C5B1] sm:text-lg">
            Have a question about renting equipment or using Rentora?
            We&apos;d love to hear from you. Reach out and let&apos;s make your
            rental experience easier.
          </p>

          <div className="mt-8 flex justify-center">
            <Link
              href="/all-equipment"
              className="inline-flex items-center gap-2 rounded-xl bg-[#F5B82E] px-6 py-3.5 font-bold text-[#3B2314] transition hover:bg-[#E5A817]"
            >
              Explore Equipment
              <ArrowUpRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="mx-auto max-w-7xl px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-bold uppercase tracking-[0.2em] text-[#B78113]">
            Contact Information
          </span>

          <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Let&apos;s Start a Conversation
          </h2>

          <p className="mt-4 leading-7 text-[#806F5E]">
            Choose the easiest way to connect with the Rentora team.
            We&apos;re happy to help.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {contactDetails.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="rounded-2xl border border-[#E9DFCE] bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F5B82E]/15 text-[#B78113]">
                  <Icon size={26} />
                </div>

                <h3 className="mt-6 text-xl font-bold">{item.title}</h3>

                {item.href ? (
                  <Link
                    href={item.href}
                    className="mt-3 inline-block break-all font-semibold text-[#A36F0A] transition hover:text-[#2F2118]"
                  >
                    {item.value}
                  </Link>
                ) : (
                  <p className="mt-3 font-semibold text-[#A36F0A]">
                    {item.value}
                  </p>
                )}

                <p className="mt-3 text-sm leading-6 text-[#806F5E]">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Contact Message Section */}
      <section className="bg-[#F7F1E6] px-6 py-16 sm:py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
          <div>
            <span className="text-sm font-bold uppercase tracking-[0.2em] text-[#B78113]">
              Need Assistance?
            </span>

            <h2 className="mt-4 text-3xl font-extrabold leading-tight sm:text-4xl">
              We&apos;re Just an Email Away.
            </h2>

            <p className="mt-5 max-w-lg leading-8 text-[#806F5E]">
              Whether you&apos;re looking for equipment, managing your
              listings, or simply have a question about Rentora,
              feel free to contact us through email.
            </p>

            <Link
              href="mailto:support@rentora.com?subject=Rentora%20Support"
              className="mt-8 inline-flex items-center gap-3 rounded-xl bg-[#2F2118] px-6 py-4 font-bold text-[#FFF9EA] transition hover:bg-[#4A3527]"
            >
              <Mail size={19} className="text-[#F5B82E]" />
              Email Rentora Support
              <ArrowUpRight size={17} />
            </Link>

            <div className="mt-10 flex items-start gap-4 rounded-2xl border border-[#E9DFCE] bg-white p-5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F5B82E]/15 text-[#B78113]">
                <Clock3 size={22} />
              </div>

              <div>
                <h3 className="font-bold">We&apos;re Ready to Listen</h3>
                <p className="mt-1 text-sm leading-6 text-[#806F5E]">
                  Send us an email whenever you need assistance.
                  We&apos;ll get back to you as soon as possible.
                </p>
              </div>
            </div>
          </div>

          {/* Brand Card */}
          <div className="relative">
            <div className="rounded-3xl bg-[#2F2118] p-8 text-[#FFF9EA] shadow-xl sm:p-10">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F5B82E] text-[#3B2314]">
                <Package size={34} strokeWidth={2.5} />
              </div>

              <h3 className="mt-8 text-3xl font-extrabold">
                Rentora<span className="text-[#F5B82E]">.</span>
              </h3>

              <p className="mt-3 text-xs font-bold tracking-[4px] text-[#E5CFA9]">
                RENT SMARTER
              </p>

              <p className="mt-7 leading-8 text-[#D6C5B1]">
                Rent the equipment you need, when you need it.
                Rentora connects customers with trusted equipment
                owners for a simple and reliable rental experience.
              </p>

              <div className="mt-9 border-t border-[#80654B]/60 pt-7">
                <p className="text-sm font-semibold text-[#E5CFA9]">
                  Connect With Us
                </p>

                <div className="mt-5 flex gap-3">
                  {socialLinks.map((social) => {
                    const Icon = social.icon;

                    return (
                      <Link
                        key={social.name}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={social.name}
                        title={social.name}
                        className="flex h-11 w-11 items-center justify-center rounded-full border border-[#80654B] text-[#F5B82E] transition duration-300 hover:-translate-y-1 hover:border-[#F5B82E] hover:bg-[#F5B82E] hover:text-[#3B2314]"
                      >
                        <Icon size={20} />
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="absolute -bottom-4 -right-4 -z-10 h-32 w-32 rounded-3xl bg-[#F5B82E]/20" />
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl rounded-3xl border border-[#E9DFCE] bg-white px-7 py-12 text-center shadow-sm sm:px-12">
          <h2 className="text-3xl font-extrabold">
            Find What You Need with Rentora
          </h2>

          <p className="mx-auto mt-4 max-w-xl leading-7 text-[#806F5E]">
            Explore available equipment and discover a smarter
            way to rent.
          </p>

          <Link
            href="/all-equipment"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#F5B82E] px-7 py-3.5 font-bold text-[#3B2314] transition hover:bg-[#E5A817]"
          >
            Browse Equipment
            <ArrowUpRight size={18} />
          </Link>
        </div>
      </section>
    </main>
  );
}
