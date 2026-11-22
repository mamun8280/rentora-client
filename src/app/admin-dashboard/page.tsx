
"use client";

import { useEffect, useState } from "react";
import {
  Users,
  Package,
  ClipboardList,
  Clock,
  CheckCircle,
  XCircle,
  TrendingUp,
  Sparkles,
  RefreshCw,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

type DashboardData = {
  totalUsers: number;
  totalEquipment: number;
  totalRentals: number;
  pendingEquipment: number;
  approvedEquipment: number;
  rejectedEquipment: number;
};

const initialData: DashboardData = {
  totalUsers: 0,
  totalEquipment: 0,
  totalRentals: 0,
  pendingEquipment: 0,
  approvedEquipment: 0,
  rejectedEquipment: 0,
};


type EquipmentItem = {
  status?: string;
};

function getArray(data: unknown, keys: string[]): EquipmentItem[] {
  if (Array.isArray(data)) {
    return data as EquipmentItem[];
  }

  if (typeof data === "object" && data !== null) {
    const record = data as Record<string, unknown>;

    for (const key of keys) {
      const value = record[key];

      if (Array.isArray(value)) {
        return value as EquipmentItem[];
      }
    }
  }

  return [];
}

function getStatusCount(items: EquipmentItem[], status: string) {
  return items.filter(
    (item) =>
      String(item.status || "").toLowerCase() === status.toLowerCase()
  ).length;
}

export default function AdminDashboardPage() {
  const [dashboard, setDashboard] =
    useState<DashboardData>(initialData);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboardData = async () => {
    try {
      setError("");

      const [usersResponse, equipmentResponse, bookingsResponse] =
        await Promise.all([
          fetch(`${API_URL}/api/admin/users`),
          fetch(`${API_URL}/api/admin/equipment`),
          fetch(`${API_URL}/api/admin/bookings`),
        ]);

      if (
        !usersResponse.ok ||
        !equipmentResponse.ok ||
        !bookingsResponse.ok
      ) {
        throw new Error("Failed to fetch dashboard data");
      }

      const [usersData, equipmentData, bookingsData] =
        await Promise.all([
          usersResponse.json(),
          equipmentResponse.json(),
          bookingsResponse.json(),
        ]);

      const users = getArray(usersData, ["users", "data"]);
      const equipment = getArray(equipmentData, [
        "equipment",
        "equipments",
        "data",
      ]);
      const bookings = getArray(bookingsData, ["bookings", "data"]);

      setDashboard({
        totalUsers: users.length,
        totalEquipment: equipment.length,
        totalRentals: bookings.length,
        pendingEquipment: getStatusCount(equipment, "Pending"),
        approvedEquipment: getStatusCount(equipment, "Approved"),
        rejectedEquipment: getStatusCount(equipment, "Rejected"),
      });
    } catch (error) {
      console.error("Admin dashboard error:", error);
      setError("Dashboard data load করা যায়নি। Backend server check করো।");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;

    const loadDashboard = async () => {
      try {
        const [usersResponse, equipmentResponse, bookingsResponse] =
          await Promise.all([
            fetch(`${API_URL}/api/admin/users`),
            fetch(`${API_URL}/api/admin/equipment`),
            fetch(`${API_URL}/api/admin/bookings`),
          ]);

        if (
          !usersResponse.ok ||
          !equipmentResponse.ok ||
          !bookingsResponse.ok
        ) {
          throw new Error("Failed to fetch dashboard data");
        }

        const [usersData, equipmentData, bookingsData] =
          await Promise.all([
            usersResponse.json(),
            equipmentResponse.json(),
            bookingsResponse.json(),
          ]);

        const users = getArray(usersData, ["users", "data"]);
        const equipment = getArray(equipmentData, [
          "equipment",
          "equipments",
          "data",
        ]);
        const bookings = getArray(bookingsData, ["bookings", "data"]);

        if (!ignore) {
          setDashboard({
            totalUsers: users.length,
            totalEquipment: equipment.length,
            totalRentals: bookings.length,
            pendingEquipment: getStatusCount(equipment, "Pending"),
            approvedEquipment: getStatusCount(equipment, "Approved"),
            rejectedEquipment: getStatusCount(equipment, "Rejected"),
          });
        }
      } catch (error) {
        console.error("Admin dashboard error:", error);

        if (!ignore) {
          setError("Dashboard data load করা যায়নি। Backend server check করো।");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    loadDashboard();

    return () => {
      ignore = true;
    };
  }, []);

  const stats = [
    {
      title: "Total Users",
      value: dashboard.totalUsers,
      description: "Registered platform users",
      icon: Users,
      iconTone: "bg-[#3B2314] text-[#F5B82E]",
    },
    {
      title: "Total Equipment",
      value: dashboard.totalEquipment,
      description: "All listed equipment",
      icon: Package,
      iconTone: "bg-[#F5B82E] text-[#3B2314]",
    },
    {
      title: "Total Rentals",
      value: dashboard.totalRentals,
      description: "All booking records",
      icon: ClipboardList,
      iconTone: "bg-[#EBD3B0] text-[#5A3420]",
    },
    {
      title: "Pending Equipment",
      value: dashboard.pendingEquipment,
      description: "Waiting for approval",
      icon: Clock,
      iconTone: "bg-[#FDE9A8] text-[#7C4A0E]",
    },
  ];

  const activities = [
    {
      title: "Approved Equipment",
      description: "Total approved equipment items",
      value: dashboard.approvedEquipment,
      icon: CheckCircle,
      iconTone: "bg-[#ECF6D8] text-[#3F6212]",
    },
    {
      title: "Rejected Equipment",
      description: "Total rejected equipment items",
      value: dashboard.rejectedEquipment,
      icon: XCircle,
      iconTone: "bg-[#FDE4DC] text-[#9A3412]",
    },
    {
      title: "Platform Activity",
      description: "Total rental records on the platform",
      value: dashboard.totalRentals,
      icon: TrendingUp,
      iconTone: "bg-[#FDE9A8] text-[#7C4A0E]",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
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

          <button
            onClick={() => {
              setLoading(true);
              fetchDashboardData();
            }}
            disabled={loading}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#F5B82E] px-4 py-2 text-sm font-bold text-[#3B2314] transition hover:bg-[#e6a91f] disabled:opacity-60"
          >
            <RefreshCw
              size={15}
              className={loading ? "animate-spin" : ""}
            />
            Refresh Dashboard
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Main Statistics */}
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
                  {loading ? "..." : stat.value}
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

      {/* Equipment Summary */}
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
                  {loading ? "..." : activity.value}
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
