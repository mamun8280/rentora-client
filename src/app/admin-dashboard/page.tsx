import {
  Users,
  Package,
  ClipboardList,
  Clock,
  CheckCircle,
  XCircle,
  TrendingUp,
  Sparkles,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const stats = [
  {
    title: "Total Users",
    value: "0",
    description: "Registered platform users",
    icon: Users,
    iconTone: "bg-[#3B2314] text-[#F5B82E]",
  },
  {
    title: "Total Equipment",
    value: "0",
    description: "All listed equipment",
    icon: Package,
    iconTone: "bg-[#F5B82E] text-[#3B2314]",
  },
  {
    title: "Total Rentals",
    value: "0",
    description: "All booking records",
    icon: ClipboardList,
    iconTone: "bg-[#EBD3B0] text-[#5A3420]",
  },
  {
    title: "Pending Equipment",
    value: "0",
    description: "Waiting for approval",
    icon: Clock,
    iconTone: "bg-[#FDE9A8] text-[#7C4A0E]",
  },
];

const activities = [
  {
    title: "Approved Equipment",
    description: "Total approved equipment items",
    value: "0",
    icon: CheckCircle,
    iconTone: "bg-[#ECF6D8] text-[#3F6212]",
  },
  {
    title: "Rejected Equipment",
    description: "Total rejected equipment items",
    value: "0",
    icon: XCircle,
    iconTone: "bg-[#FDE4DC] text-[#9A3412]",
  },
  {
    title: "Platform Activity",
    description: "Monitor users and rental activities",
    value: "Active",
    icon: TrendingUp,
    iconTone: "bg-[#FDE9A8] text-[#7C4A0E]",
  },
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      {/* Welcome banner */}
      <div className="relative overflow-hidden rounded-3xl bg-[#3B2314] p-6 shadow-xl shadow-[#3B2314]/15 sm:p-9">
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[#F5B82E]/20 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-20 right-24 h-56 w-56 rounded-full bg-[#B4651B]/30 blur-3xl" />

        <div className="relative">
          <p className="inline-flex items-center gap-2 rounded-full bg-[#F5B82E]/15 px-3 py-1 text-xs font-bold text-[#F5B82E]">
            <Sparkles size={14} />
            Admin dashboard
          </p>

          <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-[#FFF3CF] sm:text-3xl">
            Dashboard Overview
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-[#FDE9A8]/75">
            Welcome to Rentora Admin Dashboard. Manage your platform
            from one place.
          </p>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <Card
            key={stat.title}
            className="gap-0 rounded-2xl border-0 bg-white p-0 shadow-sm ring-1 ring-[#EBDCB5] transition-all hover:-translate-y-1 hover:shadow-md hover:shadow-[#3B2314]/10 hover:ring-[#F5B82E]"
          >
            <CardContent className="flex items-start justify-between gap-3 p-5">
              <div>
                <p className="text-sm font-semibold text-[#6B4426]/80">
                  {stat.title}
                </p>

                <h2 className="mt-2 text-3xl font-extrabold text-[#3B2314]">
                  {stat.value}
                </h2>

                <p className="mt-2 text-xs text-[#6B4426]/70">
                  {stat.description}
                </p>
              </div>

              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${stat.iconTone}`}
              >
                <stat.icon className="h-6 w-6" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Additional Statistics */}
      <div>
        <h2 className="mb-4 flex items-center gap-3 text-xl font-extrabold text-[#3B2314]">
          <span className="h-5 w-1.5 rounded-full bg-[#F5B82E]" />
          Equipment Summary
        </h2>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {activities.map((activity) => (
            <Card
              key={activity.title}
              className="gap-0 rounded-2xl border-0 bg-white p-0 shadow-sm ring-1 ring-[#EBDCB5] transition-all hover:shadow-md hover:shadow-[#3B2314]/10 hover:ring-[#F5B82E]"
            >
              <CardHeader className="flex flex-row items-center justify-between px-5 pb-2 pt-5">
                <CardTitle className="text-base font-bold text-[#3B2314]">
                  {activity.title}
                </CardTitle>

                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${activity.iconTone}`}
                >
                  <activity.icon className="h-5 w-5" />
                </div>
              </CardHeader>

              <CardContent className="px-5 pb-5">
                <p className="text-2xl font-extrabold text-[#B4651B]">
                  {activity.value}
                </p>

                <p className="mt-1 text-xs text-[#6B4426]/70">
                  {activity.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Admin Information */}
      <Card className="gap-0 rounded-3xl border-0 bg-[#FFF3CF] p-0 shadow-none ring-1 ring-[#F5D77A]">
        <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:p-8">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white text-[#B4651B] shadow-sm">
            <TrendingUp className="h-7 w-7" />
          </div>

          <div>
            <h2 className="text-lg font-extrabold text-[#3B2314]">
              Manage Your Platform
            </h2>
            <p className="mt-1 text-sm leading-6 text-[#6B4426]/85">
              Manage registered users, review equipment submissions
              and monitor all rental activities from the sidebar.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}