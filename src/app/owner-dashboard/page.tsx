
"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Package,
  CalendarDays,
  Banknote,
  ClipboardList,
  Plus,
  ArrowRight,
  Sparkles,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";

import { authClient } from "@/lib/auth-client";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface Equipment {
  _id: string;
  equipmentName?: string;
  ownerEmail?: string;
  status?: string;
}

interface Booking {
  _id: string;
  ownerEmail?: string;
  bookingAmount?: number;
  paymentStatus?: string;
  bookingStatus?: string;
}

interface ApiResponse {
  success?: boolean;
  equipment?: Equipment[];
  equipments?: Equipment[];
  bookings?: Booking[];
  data?: Equipment[] | Booking[];
  message?: string;
}

function getEquipmentArray(data: unknown): Equipment[] {
  if (Array.isArray(data)) return data as Equipment[];

  if (typeof data !== "object" || data === null) return [];

  const response = data as ApiResponse;

  if (Array.isArray(response.equipment)) return response.equipment;
  if (Array.isArray(response.equipments)) return response.equipments;
  if (Array.isArray(response.data)) return response.data as Equipment[];

  return [];
}

function getBookingArray(data: unknown): Booking[] {
  if (Array.isArray(data)) return data as Booking[];

  if (typeof data !== "object" || data === null) return [];

  const response = data as ApiResponse;

  if (Array.isArray(response.bookings)) return response.bookings;
  if (Array.isArray(response.data)) return response.data as Booking[];

  return [];
}

function isPaid(booking: Booking) {
  return booking.paymentStatus?.toLowerCase() === "paid";
}

function isPending(booking: Booking) {
  return booking.bookingStatus?.toLowerCase() === "pending";
}

async function parseResponse(
  response: Response,
  label: string
): Promise<unknown> {
  const text = await response.text();

  let body: unknown;

  try {
    body = text ? JSON.parse(text) : [];
  } catch {
    throw new Error(`${label} API returned invalid JSON (${response.status})`);
  }

  if (!response.ok) {
    const message =
      typeof body === "object" && body !== null && "message" in body
        ? String(body.message)
        : "Request failed";

    throw new Error(`${label} API Error (${response.status}): ${message}`);
  }

  return body;
}

async function getAuthToken(): Promise<string> {
  const { data, error } = await authClient.token();

  if (error || !data?.token) {
    throw new Error("Authentication token not found. Please login again.");
  }

  return data.token;
}

export default function OwnerDashboardPage() {
  const { data: session, isPending: sessionLoading } = authClient.useSession();

  const ownerEmail = String(session?.user?.email ?? "");

  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = useCallback(async () => {
    if (!ownerEmail) return;

    setLoading(true);
    setError("");

    try {
      const token = await getAuthToken();

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const equipmentUrl = `${API_URL}/api/equipment/my-equipment/${encodeURIComponent(ownerEmail)}`;
      const bookingsUrl = `${API_URL}/api/bookings/owner/${encodeURIComponent(ownerEmail)}`;

      const [equipmentResponse, bookingsResponse] = await Promise.all([
        fetch(equipmentUrl, { headers }),
        fetch(bookingsUrl, { headers }),
      ]);

      const [equipmentBody, bookingsBody] = await Promise.all([
        parseResponse(equipmentResponse, "Equipment"),
        parseResponse(bookingsResponse, "Bookings"),
      ]);

      setEquipment(getEquipmentArray(equipmentBody));
      setBookings(getBookingArray(bookingsBody));
    } catch (err) {
      console.error("Owner Dashboard Error:", err);

      setError(
        err instanceof Error ? err.message : "Failed to load dashboard data."
      );
    } finally {
      setLoading(false);
    }
  }, [ownerEmail]);

  useEffect(() => {
    if (sessionLoading || !ownerEmail) return;

    let ignore = false;

    async function fetchDashboard() {
      try {
        const token = await getAuthToken();

        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const equipmentUrl = `${API_URL}/api/equipment/my-equipment/${encodeURIComponent(ownerEmail)}`;
        const bookingsUrl = `${API_URL}/api/bookings/owner/${encodeURIComponent(ownerEmail)}`;

        const [equipmentResponse, bookingsResponse] = await Promise.all([
          fetch(equipmentUrl, { headers }),
          fetch(bookingsUrl, { headers }),
        ]);

        const [equipmentBody, bookingsBody] = await Promise.all([
          parseResponse(equipmentResponse, "Equipment"),
          parseResponse(bookingsResponse, "Bookings"),
        ]);

        if (ignore) return;

        setEquipment(getEquipmentArray(equipmentBody));
        setBookings(getBookingArray(bookingsBody));
        setError("");
      } catch (err) {
        if (!ignore) {
          console.error("Owner Dashboard Error:", err);
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load dashboard data."
          );
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    void fetchDashboard();

    return () => {
      ignore = true;
    };
  }, [ownerEmail, sessionLoading]);

  const totalEquipment = equipment.length;
  const totalRentals = bookings.length;
  const pendingRequests = bookings.filter(isPending).length;

  const totalEarnings = bookings
    .filter(isPaid)
    .reduce(
      (total, booking) => total + (Number(booking.bookingAmount) || 0),
      0
    );

  const stats = [
    {
      title: "Total Equipment",
      value: totalEquipment.toString(),
      description: "Equipment listed by you",
      icon: Package,
      iconTone: "bg-[#3B2314] text-[#F5B82E]",
    },
    {
      title: "Total Rentals",
      value: totalRentals.toString(),
      description: "Rental bookings received",
      icon: CalendarDays,
      iconTone: "bg-[#F5B82E] text-[#3B2314]",
    },
    {
      title: "Total Earnings",
      value: `৳${totalEarnings.toLocaleString("en-BD")}`,
      description: "Total amount from paid bookings",
      icon: Banknote,
      iconTone: "bg-[#FDE9A8] text-[#7C4A0E]",
    },
    {
      title: "Pending Requests",
      value: pendingRequests.toString(),
      description: "Requests waiting for approval",
      icon: ClipboardList,
      iconTone: "bg-[#EBD3B0] text-[#5A3420]",
    },
  ];

  if (sessionLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <RefreshCw className="h-8 w-8 animate-spin text-[#B4651B]" />
      </div>
    );
  }

  if (!ownerEmail) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-gray-500">
          Please login to view your owner dashboard.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
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
              Welcome, {session?.user?.name || "Owner"}!
            </h2>

            <p className="mt-2 max-w-md text-sm leading-6 text-[#FDE9A8]/75">
              Manage your equipment, rental requests and earnings.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => void loadDashboard()}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#F5B82E]/40 px-4 py-3.5 text-sm font-bold text-[#FDE9A8] transition hover:bg-white/10 disabled:opacity-60"
            >
              <RefreshCw size={17} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>

            <Link
              href="/owner-dashboard/add-equipment"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#F5B82E] px-6 py-3.5 text-sm font-extrabold text-[#3B2314] shadow-lg shadow-black/20 transition hover:bg-[#FFC94D] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#F5B82E]/40"
            >
              <Plus size={18} />
              Add Equipment
            </Link>
          </div>
        </div>
      </div>

      {error && (
        <div className="flex flex-wrap items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle size={20} />
          <span className="min-w-0 flex-1 wrap-break-word">{error}</span>
          <button
            onClick={() => void loadDashboard()}
            disabled={loading}
            className="font-bold underline"
          >
            Retry
          </button>
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-[#EBDCB5] transition hover:shadow-md hover:shadow-[#3B2314]/5"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-[#6B4426]/80">
                    {stat.title}
                  </p>
                  <h3 className="mt-3 wrap-break-word text-3xl font-extrabold text-[#3B2314]">
                    {stat.value}
                  </h3>
                </div>

                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${stat.iconTone}`}
                >
                  <Icon className="h-6 w-6" />
                </div>
              </div>

              <p className="mt-4 border-t border-[#F5EBCF] pt-3 text-xs text-[#6B4426]/70">
                {stat.description}
              </p>
            </div>
          );
        })}
      </div>

      {loading && (
        <p className="flex items-center gap-2 text-sm text-[#6B4426]">
          <RefreshCw size={15} className="animate-spin" />
          Updating dashboard...
        </p>
      )}

      <div className="rounded-3xl bg-[#FFF3CF] p-6 ring-1 ring-[#F5D77A] sm:p-8">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-[#B4651B] shadow-sm">
              <Package size={24} />
            </div>

            <div>
              <h3 className="text-lg font-extrabold text-[#3B2314]">
                {totalEquipment === 0
                  ? "Start managing your equipment"
                  : "Keep growing your rental business"}
              </h3>

              <p className="mt-1.5 text-sm text-[#6B4426]/85">
                {totalEquipment === 0
                  ? "Add your first equipment and start receiving rental requests."
                  : `You currently have ${totalEquipment} equipment listing(s). Add more to grow your business.`}
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
