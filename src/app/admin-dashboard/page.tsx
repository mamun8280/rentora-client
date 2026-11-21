
import {
  Users,
  Package,
  ClipboardList,
  Clock,
  CheckCircle,
  XCircle,
  TrendingUp,
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
  },
  {
    title: "Total Equipment",
    value: "0",
    description: "All listed equipment",
    icon: Package,
  },
  {
    title: "Total Rentals",
    value: "0",
    description: "All booking records",
    icon: ClipboardList,
  },
  {
    title: "Pending Equipment",
    value: "0",
    description: "Waiting for approval",
    icon: Clock,
  },
];

const activities = [
  {
    title: "Approved Equipment",
    description: "Total approved equipment items",
    value: "0",
    icon: CheckCircle,
  },
  {
    title: "Rejected Equipment",
    description: "Total rejected equipment items",
    value: "0",
    icon: XCircle,
  },
  {
    title: "Platform Activity",
    description: "Monitor users and rental activities",
    value: "Active",
    icon: TrendingUp,
  },
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      {/* Page Heading */}
      <div>
        <h1 className="text-2xl font-bold text-[#5C3D25] sm:text-3xl">
          Dashboard Overview
        </h1>
        <p className="mt-2 text-sm text-[#A0805B]">
          Welcome to Rentora Admin Dashboard. Manage your platform
          from one place.
        </p>
      </div>

      {/* Statistics */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <Card
            key={stat.title}
            className="border-[#E8D8B8] bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
          >
            <CardContent className="flex items-center justify-between p-5">
              <div>
                <p className="text-sm font-medium text-[#A0805B]">
                  {stat.title}
                </p>

                <h2 className="mt-2 text-3xl font-bold text-[#5C3D25]">
                  {stat.value}
                </h2>

                <p className="mt-1 text-xs text-[#A0805B]">
                  {stat.description}
                </p>
              </div>

              <div className="rounded-xl bg-[#F8E9C9] p-3">
                <stat.icon className="h-6 w-6 text-[#8B633E]" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Additional Statistics */}
      <div>
        <h2 className="mb-4 text-xl font-bold text-[#5C3D25]">
          Equipment Summary
        </h2>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {activities.map((activity) => (
            <Card
              key={activity.title}
              className="border-[#E8D8B8] bg-white shadow-sm"
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-base font-semibold text-[#705238]">
                  {activity.title}
                </CardTitle>

                <activity.icon className="h-5 w-5 text-[#8B633E]" />
              </CardHeader>

              <CardContent>
                <p className="text-2xl font-bold text-[#5C3D25]">
                  {activity.value}
                </p>

                <p className="mt-1 text-xs text-[#A0805B]">
                  {activity.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Admin Information */}
      <Card className="border-[#E8D8B8] bg-[#FFF3D9] shadow-sm">
        <CardContent className="flex flex-col gap-3 p-6 sm:flex-row sm:items-center">
          <div className="rounded-xl bg-white p-3">
            <TrendingUp className="h-7 w-7 text-[#8B633E]" />
          </div>

          <div>
            <h2 className="font-bold text-[#5C3D25]">
              Manage Your Platform
            </h2>
            <p className="mt-1 text-sm text-[#806344]">
              Manage registered users, review equipment submissions
              and monitor all rental activities from the sidebar.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
