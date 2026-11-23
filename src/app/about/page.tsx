import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  ShieldCheck,
  Users,
  Wrench,
  Target,
  HeartHandshake,
} from "lucide-react";

/*
  Palette (Tailwind arbitrary values, no config change needed)
  Espresso  #2E211A  dark sections, headings
  Coffee    #5A4336  body text
  Honey     #E3B04B  accent (soft gold, not neon)
  Honey-lt  #F6E7C1  light accent tint
  Linen     #FAF6EF  page background
  Line      #E9DECB  borders
*/

const values = [
  {
    icon: ShieldCheck,
    title: "Trust & Reliability",
    description:
      "We believe equipment rental should be simple, transparent, and reliable for everyone.",
  },
  {
    icon: Users,
    title: "Community First",
    description:
      "We connect equipment owners and customers to build a helpful rental community.",
  },
  {
    icon: Clock3,
    title: "Convenience",
    description:
      "Find and rent the equipment you need without unnecessary complications.",
  },
];

const benefits = [
  "Discover equipment from different owners",
  "Manage your equipment listings easily",
  "A convenient rental experience",
  "Dedicated dashboards for different user roles",
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#FAF6EF] text-[#2E211A]">
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#2E211A] text-[#FAF6EF]">
        <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-[#E3B04B]/15 blur-3xl" />
        <div className="absolute -bottom-40 -left-24 h-96 w-96 rounded-full bg-[#E3B04B]/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 py-24 text-center sm:py-32">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#E3B04B]/30 bg-[#E3B04B]/10 px-4 py-2 text-sm font-medium text-[#F6E7C1]">
            <Wrench size={15} />
            About Rentora
          </span>

          <h1 className="mx-auto mt-6 max-w-4xl text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
            Making equipment rental simple and accessible
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-[#FAF6EF]/70 sm:text-lg">
            Rentora connects equipment owners with people who need the right
            tools and equipment. Our goal is to make renting easier,
            convenient, and accessible.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href="/all-equipment"
              className="inline-flex items-center gap-2 rounded-xl bg-[#eea91e] px-6 py-3.5 font-semibold text-[#2E211A] transition hover:bg-[#EDC066] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e7ac34]"
            >
              Explore equipment
              <ArrowRight size={18} />
            </Link>

            <Link
              href="/"
              className="rounded-xl border border-[#FAF6EF]/25 px-6 py-3.5 font-semibold text-[#FAF6EF] transition hover:bg-[#FAF6EF]/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FAF6EF]"
            >
              Back to home
            </Link>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-2 lg:py-24">
        <div>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            A smarter way to rent equipment
          </h2>

          <div className="mt-4 h-1 w-14 rounded-full bg-[#E3B04B]" />

          <p className="mt-6 max-w-xl leading-8 text-[#5A4336]">
            Rentora is an equipment rental platform designed to bring
            equipment owners and customers together. Instead of purchasing
            equipment that may only be needed temporarily, customers can
            explore available listings and find suitable rental options.
          </p>

          <p className="mt-4 max-w-xl leading-8 text-[#5A4336]">
            We also help equipment owners showcase and manage their
            equipment listings through an organized platform.
          </p>
        </div>

        <div className="rounded-3xl border border-[#E9DECB] bg-white p-8 shadow-sm sm:p-10">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F6E7C1] text-[#e09a43]">
            <Target size={28} />
          </div>

          <h3 className="mt-6 text-2xl font-bold">Our mission</h3>

          <p className="mt-4 leading-8 text-[#5A4336]">
            To make equipment rental more accessible by creating a
            convenient platform where owners can share their equipment
            and customers can find what they need.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="border-y border-[#E9DECB] bg-[#F3EADB] px-6 py-20 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold sm:text-4xl">
              What we stand for
            </h2>
            <p className="mt-4 leading-7 text-[#5A4336]">
              The principles that guide the Rentora experience.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {values.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="rounded-2xl border border-[#E9DECB] bg-[#FAF6EF] p-7 transition duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-[#2E211A]/10"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#2E211A] text-[#E3B04B]">
                    <Icon size={27} />
                  </div>

                  <h3 className="mt-6 text-xl font-bold">{item.title}</h3>

                  <p className="mt-3 leading-7 text-[#5A4336]">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Rentora */}
      <section className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-2 lg:py-24">
        <div className="rounded-3xl bg-[#2E211A] p-8 text-[#FAF6EF] sm:p-12">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E3B04B]/15 text-[#E3B04B]">
            <HeartHandshake size={29} />
          </div>

          <h2 className="mt-7 text-3xl font-bold">Why choose Rentora?</h2>

          <p className="mt-4 leading-8 text-[#FAF6EF]/70">
            Whether you want to rent equipment or make your equipment
            available to others, Rentora provides an organized place to
            get started.
          </p>

          <Link
            href="/all-equipment"
            className="mt-8 inline-flex items-center gap-2 font-semibold text-[#E3B04B] transition hover:gap-3"
          >
            Find equipment
            <ArrowRight size={18} />
          </Link>
        </div>

        <div>
          <h2 className="text-3xl font-bold sm:text-4xl">
            Everything you need in one place
          </h2>

          <ul className="mt-8 space-y-4">
            {benefits.map((benefit) => (
              <li
                key={benefit}
                className="flex items-center gap-4 rounded-2xl border border-[#E9DECB] bg-white px-5 py-4"
              >
                <CheckCircle2
                  size={22}
                  className="shrink-0 text-[#C48A2A]"
                />
                <span className="font-medium text-[#2E211A]">{benefit}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-20 lg:pb-24">
        <div className="mx-auto max-w-7xl rounded-3xl bg-linear-to-br from-[#664c3d] to-[#2E211A] px-7 py-14 text-center sm:px-12 sm:py-16">
          <h2 className="text-3xl font-bold text-[#FAF6EF] sm:text-4xl">
            Ready to get started?
          </h2>

          <p className="mx-auto mt-4 max-w-xl leading-7 text-[#FAF6EF]/75">
            Discover equipment, explore rental opportunities, and
            experience a simpler way to rent with Rentora.
          </p>

          <Link
            href="/all-equipment"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#eea91e]  px-6 py-3.5 font-semibold text-[#2E211A] transition hover:bg-[#EDC066] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E3B04B]"
          >
            Explore equipment
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </main>
  );
}
