"use client";

import { useCallback, useEffect, useState } from "react";
import {
  CalendarDays,
  Heart,
  Package,
  RefreshCw,
  TrendingUp,
  Clock,
  AlertCircle,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface Booking {
  _id: string;
  equipmentName?: string;
  rentalStartDate?: string;
  rentalEndDate?: string;
  rentalDuration?: string;
  bookingAmount?: number;
  paymentStatus?: string;
  bookingStatus?: string;
  createdAt?: string;
}

interface Favorite {
  _id: string;
  equipmentName?: string;
  createdAt?: string;
}

interface BookingResponse {
  success: boolean;
  bookings?: Booking[];
  message?: string;
}

interface FavoriteResponse {
  success: boolean;
  favorites?: Favorite[];
  message?: string;
}

function formatDate(date?: string) {
  if (!date) return "N/A";
  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) return "N/A";
  return parsedDate.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatAmount(amount?: number) {
  return `৳${(amount || 0).toLocaleString("en-BD")}`;
}

function isActiveRental(booking: Booking) {
  if (
    booking.paymentStatus?.toLowerCase() !== "paid" ||
    booking.bookingStatus?.toLowerCase() !== "confirmed" ||
    !booking.rentalStartDate ||
    !booking.rentalEndDate
  ) {
    return false;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const startDate = new Date(booking.rentalStartDate);
  const endDate = new Date(booking.rentalEndDate);

  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
    return false;
  }

  startDate.setHours(0, 0, 0, 0);
  endDate.setHours(23, 59, 59, 999);

  return today >= startDate && today <= endDate;
}

function statusStyle(status?: string) {
  switch (status?.toLowerCase()) {
    case "confirmed":
      return "bg-green-100 text-green-700";
    case "cancelled":
      return "bg-red-100 text-red-700";
    default:
      return "bg-[#FFE9A8] text-[#8A5A13]";
  }
}

export default function CustomerDashboard() {
  const { data: session, isPending } = authClient.useSession();

  const userEmail: string = String(session?.user?.email ?? "");

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const fetchDashboard = useCallback(async () => {
    const email = encodeURIComponent(userEmail);

    const [bookingsResponse, favoritesResponse] = await Promise.all([
      fetch(`${API_URL}/api/bookings/customer/${email}`),
      fetch(`${API_URL}/api/favorites/${email}`),
    ]);

    if (!bookingsResponse.ok || !favoritesResponse.ok) {
      throw new Error("Failed to fetch dashboard data");
    }

    const bookingsData = (await bookingsResponse.json()) as BookingResponse;
    const favoritesData = (await favoritesResponse.json()) as FavoriteResponse;

    return {
      bookings: bookingsData.bookings || [],
      favorites: favoritesData.favorites || [],
    };
  }, [userEmail]);

  // Initial load
  useEffect(() => {
    if (isPending || !userEmail) return;

    let ignore = false;

    fetchDashboard()
      .then((data) => {
        if (ignore) return;
        setBookings(data.bookings);
        setFavorites(data.favorites);
        setError("");
      })
      .catch((err) => {
        console.error("Customer Dashboard Error:", err);
        if (!ignore) setError("Failed to load dashboard data. Please try again.");
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [userEmail, isPending, fetchDashboard]);

  // Manual refresh keeps the page visible instead of showing the full-page loader
  const handleRefresh = useCallback(async () => {
    if (!userEmail) return;

    setRefreshing(true);
    try {
      const data = await fetchDashboard();
      setBookings(data.bookings);
      setFavorites(data.favorites);
      setError("");
    } catch (err) {
      console.error("Customer Dashboard Error:", err);
      setError("Failed to load dashboard data. Please try again.");
    } finally {
      setRefreshing(false);
    }
  }, [userEmail, fetchDashboard]);

  const activeRentals = bookings.filter(isActiveRental).length;

  const recentBookings = [...bookings]
    .sort(
      (a, b) =>
        new Date(b.createdAt || 0).getTime() -
        new Date(a.createdAt || 0).getTime()
    )
    .slice(0, 5);

  if (isPending || loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="h-8 w-8 animate-spin text-[#E0A100]" />
          <p className="text-sm text-[#80664A]">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!userEmail) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-[#80664A]">Please log in to view your dashboard.</p>
      </div>
    );
  }

  const stats = [
    {
      label: "Total rentals",
      value: bookings.length,
      note: "All your rental bookings",
      icon: Package,
    },
    {
      label: "Favorites",
      value: favorites.length,
      note: "Equipment you saved",
      icon: Heart,
    },
    {
      label: "Active rentals",
      value: activeRentals,
      note: "Paid and confirmed, running now",
      icon: TrendingUp,
    },
  ];

  return (
    <div className="space-y-8 bg-[#FFF9E8] p-4 md:p-6 lg:p-8">
      {/* Welcome */}
      <section className="relative overflow-hidden rounded-3xl bg-[#2B1A0E] p-6 text-[#FFF4D1] md:p-9">
        <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-[#FFC21A]/25 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 left-1/3 h-56 w-56 rounded-full bg-[#E0A100]/15 blur-3xl" />

        <div className="relative flex flex-col justify-between gap-5 md:flex-row md:items-center">
          <div>
            <p className="text-sm font-medium text-[#FFD65C]">
              Customer dashboard
            </p>

            <h1 className="mt-2 text-2xl font-extrabold tracking-tight md:text-4xl">
              Welcome back,{" "}
              <span className="text-[#FFC21A]">
                {session?.user?.name || "Customer"}
              </span>
            </h1>

            <p className="mt-2 max-w-md text-sm leading-6 text-[#D9C4A0]">
              Manage your rentals and keep track of what you have booked.
            </p>
          </div>

          <button
            onClick={() => void handleRefresh()}
            disabled={refreshing}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#FFC21A] px-5 py-2.5 text-sm font-bold text-[#2B1A0E] transition hover:bg-[#FFD04D] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#FFC21A]/40 disabled:opacity-60"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>
      </section>

      {/* Error */}
      {error && (
        <div
          role="alert"
          className="flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{error}</span>
          <button
            onClick={() => void handleRefresh()}
            className="ml-auto font-semibold underline"
          >
            Retry
          </button>
        </div>
      )}

      {/* Stats */}
      <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map(({ label, value, note, icon: Icon }) => (
          <div
            key={label}
            className="rounded-3xl border border-[#EADFC8] bg-white p-6 transition hover:border-[#FFC21A] hover:shadow-[0_20px_40px_-24px_rgba(138,90,19,0.5)]"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-[#80664A]">{label}</p>
                <h2 className="mt-2 text-4xl font-extrabold text-[#2B1A0E]">
                  {value}
                </h2>
              </div>

              <div className="rounded-2xl bg-[#FFF1BF] p-3 text-[#B8860B]">
                <Icon className="h-6 w-6" />
              </div>
            </div>

            <p className="mt-4 text-sm text-[#967B5C]">{note}</p>
          </div>
        ))}
      </section>

      {/* Recent activity */}
      <section className="overflow-hidden rounded-3xl border border-[#EADFC8] bg-white">
        <div className="flex flex-col gap-2 border-b border-[#F3EAD3] p-5 sm:flex-row sm:items-center sm:justify-between md:px-6">
          <div>
            <h2 className="text-lg font-bold text-[#2B1A0E]">
              Recent rental activity
            </h2>
            <p className="mt-1 text-sm text-[#80664A]">
              Your latest rental bookings
            </p>
          </div>

          <span className="w-fit rounded-full bg-[#FFF1BF] px-3 py-1 text-xs font-semibold text-[#8A5A13]">
            Showing {recentBookings.length} of {bookings.length}
          </span>
        </div>

        {recentBookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-5 py-14 text-center">
            <div className="rounded-full bg-[#FFF1BF] p-4">
              <CalendarDays className="h-8 w-8 text-[#B8860B]" />
            </div>

            <h3 className="mt-4 font-semibold text-[#2B1A0E]">
              No rental activity yet
            </h3>

            <p className="mt-1 text-sm text-[#80664A]">
              Your rental bookings will appear here.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[#F3EAD3]">
            {recentBookings.map((booking) => (
              <div
                key={booking._id}
                className="flex flex-col gap-4 p-5 transition hover:bg-[#FFFBF0] sm:flex-row sm:items-center sm:justify-between md:px-6"
              >
                <div className="flex items-start gap-4">
                  <div className="rounded-2xl bg-[#2B1A0E] p-3 text-[#FFC21A]">
                    <Package className="h-5 w-5" />
                  </div>

                  <div>
                    <h3 className="font-semibold text-[#2B1A0E]">
                      {booking.equipmentName || "Equipment"}
                    </h3>

                    <p className="mt-1 text-xs text-[#80664A]">
                      Booked on {formatDate(booking.createdAt)}
                    </p>

                    <p className="mt-0.5 text-xs text-[#80664A]">
                      Rental: {formatDate(booking.rentalStartDate)} to{" "}
                      {formatDate(booking.rentalEndDate)}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 sm:justify-end">
                  <div className="sm:text-right">
                    <p className="font-extrabold text-[#8A5A13]">
                      {formatAmount(booking.bookingAmount)}
                    </p>

                    <p className="mt-1 text-xs text-[#80664A]">
                      <Clock className="mr-1 inline h-3 w-3" />
                      {booking.rentalDuration || "Rental"}
                    </p>
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyle(
                      booking.bookingStatus
                    )}`}
                  >
                    {booking.bookingStatus || "Pending"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}