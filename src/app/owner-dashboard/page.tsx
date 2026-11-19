import {
  Package,
  CalendarDays,
  Banknote,
  ClipboardList,
  Plus,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

const stats = [
  {
    title: "Total Equipment",
    value: "0",
    description: "Equipment listed by you",
    icon: Package,
    iconTone: "bg-[#3B2314] text-[#F5B82E]",
  },
  {
    title: "Total Rentals",
    value: "0",
    description: "Rental bookings received",
    icon: CalendarDays,
    iconTone: "bg-[#F5B82E] text-[#3B2314]",
  },
  {
    title: "Total Earnings",
    value: "৳0",
    description: "Your total earnings",
    icon: Banknote,
    iconTone: "bg-[#FDE9A8] text-[#7C4A0E]",
  },
  {
    title: "Pending Requests",
    value: "0",
    description: "Requests waiting for approval",
    icon: ClipboardList,
    iconTone: "bg-[#EBD3B0] text-[#5A3420]",
  },
];

export default function OwnerDashboardPage() {
  return (
    <div className="space-y-8">
      {/* Welcome banner */}
      <div className="relative overflow-hidden rounded-3xl bg-[#3B2314] p-6 shadow-xl shadow-[#3B2314]/15 sm:p-9">
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[#F5B82E]/20 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-20 right-24 h-56 w-56 rounded-full bg-[#B4651B]/30 blur-3xl" />

        <div className="relative flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-[#F5B82E]/15 px-3 py-1 text-xs font-bold text-[#F5B82E]">
              <Sparkles size={14} />
              Owner dashboard
            </p>

            <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-[#FFF3CF] sm:text-3xl">
              Welcome to Owner Dashboard!
            </h2>
            <p className="mt-2 max-w-md text-sm leading-6 text-[#FDE9A8]/75">
              Manage your equipment, rental requests and earnings.
            </p>
          </div>

          <Link
            href="/owner-dashboard/add-equipment"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#F5B82E] px-6 py-3.5 text-sm font-extrabold text-[#3B2314] shadow-lg shadow-black/20 transition hover:bg-[#FFC94D] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#F5B82E]/40"
          >
            <Plus size={18} />
            Add Equipment
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-[#EBDCB5] transition hover:shadow-md hover:shadow-[#3B2314]/5"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-[#6B4426]/80">
                  {stat.title}
                </p>
                <h3 className="mt-3 text-3xl font-extrabold text-[#3B2314]">
                  {stat.value}
                </h3>
              </div>

              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${stat.iconTone}`}
              >
                <stat.icon className="h-6 w-6" />
              </div>
            </div>

            <p className="mt-4 border-t border-[#F5EBCF] pt-3 text-xs text-[#6B4426]/70">
              {stat.description}
            </p>
          </div>
        ))}
      </div>

      {/* Call to action */}
      <div className="rounded-3xl bg-[#FFF3CF] p-6 ring-1 ring-[#F5D77A] sm:p-8">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-[#B4651B] shadow-sm">
              <Package size={24} />
            </div>

            <div>
              <h3 className="text-lg font-extrabold text-[#3B2314]">
                Start managing your equipment
              </h3>
              <p className="mt-1.5 text-sm text-[#6B4426]/85">
                Add your first equipment and start receiving rental requests.
              </p>
            </div>
          </div>

          <Link
            href="/owner-dashboard/add-equipment"
            className="group inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#3B2314] px-5 py-3 text-sm font-bold text-[#FDE9A8] transition hover:bg-[#2A180D] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#3B2314]/30"
          >
            <Plus size={18} />
            Add Equipment
            <ArrowRight
              size={16}
              className="transition group-hover:translate-x-0.5"
            />
          </Link>
        </div>
      </div>
    </div>
  );
}