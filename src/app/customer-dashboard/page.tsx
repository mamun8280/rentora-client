import {
  LayoutDashboard,
  CalendarDays,
  Heart,
  Clock,
  Sparkles,
} from "lucide-react";

const stats = [
  {
    title: "Total Rentals",
    value: "0",
    icon: CalendarDays,
    iconTone: "bg-[#3B2314] text-[#F5B82E]",
  },
  {
    title: "Favorites",
    value: "0",
    icon: Heart,
    iconTone: "bg-[#F5B82E] text-[#3B2314]",
  },
  {
    title: "Active Rentals",
    value: "0",
    icon: Clock,
    iconTone: "bg-[#FDE9A8] text-[#7C4A0E]",
  },
];

export default function CustomerDashboardPage() {
  return (
    <div className="space-y-8">
      {/* Welcome banner */}
      <div className="relative overflow-hidden rounded-3xl bg-[#3B2314] p-6 shadow-xl shadow-[#3B2314]/15 sm:p-9">
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[#F5B82E]/20 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-20 right-24 h-56 w-56 rounded-full bg-[#B4651B]/30 blur-3xl" />

        <div className="relative">
          <p className="inline-flex items-center gap-2 rounded-full bg-[#F5B82E]/15 px-3 py-1 text-xs font-bold text-[#F5B82E]">
            <Sparkles size={14} />
            Customer dashboard
          </p>

          <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-[#FFF3CF] sm:text-3xl">
            Welcome Back!
          </h1>

          <p className="mt-2 max-w-md text-sm leading-6 text-[#FDE9A8]/75">
            Manage your rentals, favorites and account from here.
          </p>
        </div>
      </div>

      {/* Dashboard stats */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-[#EBDCB5] transition hover:shadow-md hover:shadow-[#3B2314]/5"
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-[#6B4426]/80">
                  {stat.title}
                </p>
                <h2 className="mt-2 text-3xl font-extrabold text-[#3B2314]">
                  {stat.value}
                </h2>
              </div>

              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${stat.iconTone}`}
              >
                <stat.icon size={24} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent activity */}
      <div className="overflow-hidden rounded-3xl bg-white shadow-xl shadow-[#3B2314]/5 ring-1 ring-[#EBDCB5]">
        <div className="flex items-center gap-3 border-b border-[#F0E3BF] px-5 py-4 sm:px-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#3B2314] text-[#F5B82E]">
            <LayoutDashboard size={20} />
          </div>

          <h2 className="text-lg font-extrabold text-[#3B2314]">
            Recent activity
          </h2>
        </div>

        <div className="flex flex-col items-center px-4 py-16 text-center">
          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-[#FDE9A8] text-[#B4651B]">
            <CalendarDays size={34} />
          </div>

          <p className="text-lg font-extrabold text-[#3B2314]">
            No recent activity
          </p>

          <p className="mt-2 max-w-sm text-sm text-[#6B4426]/80">
            Your rental activities will appear here.
          </p>
        </div>
      </div>
    </div>
  );
}