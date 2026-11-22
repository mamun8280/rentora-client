
"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Search,
  RefreshCw,
  CalendarDays,
  Package,
  Mail,
  X,
} from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface Booking {
  _id: string;
  customerName?: string;
  customerEmail?: string;
  ownerName?: string;
  ownerEmail?: string;
  equipmentName?: string;
  equipmentImage?: string;
  rentalStartDate?: string;
  rentalEndDate?: string;
  rentalDuration?: number;
  requiredQuantity?: number;
  bookingAmount?: number;
  paymentStatus?: string;
  bookingStatus?: string;
  createdAt?: string;
}

export default function AdminAllRentalsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("All");
  const [bookingFilter, setBookingFilter] = useState("All");
  const [selectedBooking, setSelectedBooking] =
    useState<Booking | null>(null);

  // Fetch bookings for Refresh button
  const fetchBookings = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/api/admin/bookings`);
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to fetch bookings");
      }

      setBookings(data.bookings || []);
    } catch (error) {
      console.error("Fetch bookings error:", error);
      toast.error("Failed to load rental records");
    } finally {
      setLoading(false);
    }
  };

  // Initial data loading
  useEffect(() => {
    let ignore = false;

    const loadBookings = async () => {
      try {
        const response = await fetch(`${API_URL}/api/admin/bookings`);
        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Failed to fetch bookings");
        }

        if (!ignore) {
          setBookings(data.bookings || []);
        }
      } catch (error) {
        console.error("Fetch bookings error:", error);

        if (!ignore) {
          toast.error("Failed to load rental records");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    loadBookings();

    return () => {
      ignore = true;
    };
  }, []);

  // Search and Filters
  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      const searchText = search.toLowerCase();

      const matchesSearch = [
        booking.customerName,
        booking.customerEmail,
        booking.ownerName,
        booking.ownerEmail,
        booking.equipmentName,
      ].some((value) =>
        value?.toLowerCase().includes(searchText)
      );

      const matchesPayment =
        paymentFilter === "All" ||
        booking.paymentStatus === paymentFilter;

      const matchesBooking =
        bookingFilter === "All" ||
        booking.bookingStatus === bookingFilter;

      return matchesSearch && matchesPayment && matchesBooking;
    });
  }, [bookings, search, paymentFilter, bookingFilter]);

  // Date formatting
  const formatDate = (date?: string) => {
    if (!date) return "N/A";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return "N/A";

    return parsedDate.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Currency formatting
  const formatAmount = (amount?: number) => {
    return `৳${Number(amount || 0).toLocaleString("en-BD")}`;
  };

  // Payment status style
  const paymentStyle = (status?: string) => {
    if (status === "Paid") {
      return "bg-green-100 text-green-700";
    }

    if (status === "Unpaid") {
      return "bg-red-100 text-red-700";
    }

    return "bg-gray-100 text-gray-600";
  };

  // Booking status style
  const bookingStyle = (status?: string) => {
    if (status === "Confirmed") {
      return "bg-green-100 text-green-700";
    }

    if (status === "Cancelled") {
      return "bg-red-100 text-red-700";
    }

    if (status === "Pending Payment") {
      return "bg-yellow-100 text-yellow-700";
    }

    return "bg-gray-100 text-gray-600";
  };

  // Summary calculations
  const paidBookings = bookings.filter(
    (booking) => booking.paymentStatus === "Paid"
  ).length;

  const totalRevenue = bookings
    .filter((booking) => booking.paymentStatus === "Paid")
    .reduce(
      (total, booking) =>
        total + Number(booking.bookingAmount || 0),
      0
    );

  return (
    <div className="min-h-screen bg-[#f5f8f5] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">

        {/* Header */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold text-[#263b30] sm:text-3xl">
              All Rentals
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Monitor and manage all rental booking activities.
            </p>
          </div>

          <button
            onClick={fetchBookings}
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
          >
            <RefreshCw
              size={16}
              className={loading ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Total Rentals</p>
            <h2 className="mt-2 text-2xl font-bold text-[#263b30]">
              {bookings.length}
            </h2>
          </div>

          <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Paid Bookings</p>
            <h2 className="mt-2 text-2xl font-bold text-green-600">
              {paidBookings}
            </h2>
          </div>

          <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Total Paid Amount</p>
            <h2 className="mt-2 text-2xl font-bold text-[#34765a]">
              {formatAmount(totalRevenue)}
            </h2>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col gap-3 rounded-xl border border-gray-100 bg-white p-4 shadow-sm lg:flex-row">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              placeholder="Search customer, owner or equipment..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-[#34765a]"
            />
          </div>

          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#34765a]"
          >
            <option value="All">All Payment Status</option>
            <option value="Paid">Paid</option>
            <option value="Unpaid">Unpaid</option>
          </select>

          <select
            value={bookingFilter}
            onChange={(e) => setBookingFilter(e.target.value)}
            className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#34765a]"
          >
            <option value="All">All Booking Status</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Pending Payment">Pending Payment</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        {/* Rentals Table */}
        <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">

          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
            <h2 className="font-semibold text-[#263b30]">
              Rental Booking Records
            </h2>

            <span className="text-sm text-gray-500">
              {filteredBookings.length} results
            </span>
          </div>

          {loading ? (
            <div className="flex min-h-60 items-center justify-center">
              <RefreshCw
                className="animate-spin text-[#34765a]"
                size={28}
              />
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="flex min-h-60 flex-col items-center justify-center px-4 text-center">
              <Package size={42} className="text-gray-300" />

              <h3 className="mt-3 font-semibold text-gray-700">
                No rental records found
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Try changing your search or filters.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-312.5 text-left text-sm">

                <thead className="bg-[#f5f8f5] text-xs uppercase tracking-wide text-gray-500">
                  <tr>
                    <th className="w-45 px-5 py-4">
                      Customer Information
                    </th>

                    <th className="w-45 px-5 py-4">
                      Owner Information
                    </th>

                    <th className="w-67.5 px-5 py-4">
                      Equipment Name
                    </th>

                    <th className="w-42.5 px-5 py-4">
                      Rental Duration
                    </th>

                    <th className="w-32.5 px-5 py-4">
                      Booking Amount
                    </th>

                    <th className="w-30 px-5 py-4">
                      Payment Status
                    </th>

                    <th className="w-32.5 px-5 py-4">
                      Booking Status
                    </th>

                    <th className="w-27.5 px-5 py-4 text-center">
                      Details
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {filteredBookings.map((booking) => (
                    <tr
                      key={booking._id}
                      className="transition hover:bg-gray-50"
                    >

                      {/* Customer Information */}
                      <td className="px-5 py-5">
                        <p className="font-semibold text-gray-800">
                          {booking.customerName || "N/A"}
                        </p>

                        <p className="mt-1 flex items-center gap-1 break-all text-xs text-gray-500">
                          <Mail size={12} className="shrink-0" />
                          {booking.customerEmail || "N/A"}
                        </p>
                      </td>

                      {/* Owner Information */}
                      <td className="px-5 py-5">
                        <p className="font-semibold text-gray-800">
                          {booking.ownerName || "N/A"}
                        </p>

                        <p className="mt-1 flex items-center gap-1 break-all text-xs text-gray-500">
                          <Mail size={12} className="shrink-0" />
                          {booking.ownerEmail || "N/A"}
                        </p>
                      </td>

                      {/* Equipment Information */}
                      <td className="px-5 py-5">
                        <div className="flex min-w-55 items-center gap-3">
                          {booking.equipmentImage ? (
                            <Image
                              src={booking.equipmentImage}
                              alt={booking.equipmentName || "Equipment"}
                              width={80}
                              height={64}
                              className="h-16 w-20 shrink-0 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="flex h-16 w-20 shrink-0 items-center justify-center rounded-lg bg-gray-100">
                              <Package
                                size={22}
                                className="text-gray-400"
                              />
                            </div>
                          )}

                          <span className="max-w-35 text-sm font-semibold text-gray-800">
                            {booking.equipmentName || "N/A"}
                          </span>
                        </div>
                      </td>

                      {/* Rental Duration */}
                      <td className="px-5 py-5">
                        <div className="flex items-start gap-2">
                          <CalendarDays
                            size={16}
                            className="mt-0.5 shrink-0 text-[#34765a]"
                          />

                          <div className="whitespace-nowrap text-xs text-gray-600">
                            <p>
                              {formatDate(booking.rentalStartDate)}
                            </p>

                            <p className="my-1 text-gray-400">
                              to
                            </p>

                            <p>
                              {formatDate(booking.rentalEndDate)}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Booking Amount */}
                      <td className="whitespace-nowrap px-5 py-5 font-semibold text-[#34765a]">
                        {formatAmount(booking.bookingAmount)}
                      </td>

                      {/* Payment Status */}
                      <td className="px-5 py-5">
                        <span
                          className={`inline-flex whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold ${paymentStyle(booking.paymentStatus)}`}
                        >
                          {booking.paymentStatus || "Unknown"}
                        </span>
                      </td>

                      {/* Booking Status */}
                      <td className="px-5 py-5">
                        <span
                          className={`inline-flex whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold ${bookingStyle(booking.bookingStatus)}`}
                        >
                          {booking.bookingStatus || "Unknown"}
                        </span>
                      </td>

                      {/* Details */}
                      <td className="px-5 py-5 text-center">
                        <button
                          onClick={() => setSelectedBooking(booking)}
                          className="rounded-lg bg-[#34765a]/10 px-3 py-2 text-xs font-semibold text-[#34765a] transition hover:bg-[#34765a]/20"
                        >
                          View Details
                        </button>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4">
          <div className="my-auto w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">

            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-[#263b30]">
                  Rental Details
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Complete booking information
                </p>
              </div>

              <button
                onClick={() => setSelectedBooking(null)}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
                title="Close"
              >
                <X size={20} />
              </button>
            </div>

            {/* Equipment */}
            <div className="mb-5 flex items-center gap-3 rounded-xl bg-[#f5f8f5] p-4">
              {selectedBooking.equipmentImage && (
                <Image
                  src={selectedBooking.equipmentImage}
                  alt={selectedBooking.equipmentName || "Equipment"}
                  width={80}
                  height={64}
                  className="h-16 w-20 shrink-0 rounded-lg object-cover"
                />
              )}

              <div>
                <p className="text-xs text-gray-500">Equipment</p>
                <p className="mt-1 font-semibold text-gray-800">
                  {selectedBooking.equipmentName || "N/A"}
                </p>
              </div>
            </div>

            {/* Customer and Owner */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500">Customer</p>

                <p className="mt-1 text-sm font-medium text-gray-800">
                  {selectedBooking.customerName || "N/A"}
                </p>

                <p className="break-all text-xs text-gray-500">
                  {selectedBooking.customerEmail || "N/A"}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500">Owner</p>

                <p className="mt-1 text-sm font-medium text-gray-800">
                  {selectedBooking.ownerName || "N/A"}
                </p>

                <p className="break-all text-xs text-gray-500">
                  {selectedBooking.ownerEmail || "N/A"}
                </p>
              </div>
            </div>

            <div className="my-5 border-t border-gray-100" />

            {/* Booking Information */}
            <div className="grid grid-cols-2 gap-4">

              <div>
                <p className="text-xs text-gray-500">Rental Start</p>
                <p className="mt-1 text-sm font-medium text-gray-800">
                  {formatDate(selectedBooking.rentalStartDate)}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500">Rental End</p>
                <p className="mt-1 text-sm font-medium text-gray-800">
                  {formatDate(selectedBooking.rentalEndDate)}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500">Rental Duration</p>
                <p className="mt-1 text-sm font-medium text-gray-800">
                  {selectedBooking.rentalDuration ?? "N/A"}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500">Required Quantity</p>
                <p className="mt-1 text-sm font-medium text-gray-800">
                  {selectedBooking.requiredQuantity ?? "N/A"}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500">Booking Amount</p>
                <p className="mt-1 text-sm font-semibold text-[#34765a]">
                  {formatAmount(selectedBooking.bookingAmount)}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500">Payment Status</p>
                <p className="mt-1 text-sm font-medium text-gray-800">
                  {selectedBooking.paymentStatus || "Unknown"}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500">Booking Status</p>
                <p className="mt-1 text-sm font-medium text-gray-800">
                  {selectedBooking.bookingStatus || "Unknown"}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500">Booking Date</p>
                <p className="mt-1 text-sm font-medium text-gray-800">
                  {formatDate(selectedBooking.createdAt)}
                </p>
              </div>

            </div>

            <button
              onClick={() => setSelectedBooking(null)}
              className="mt-6 w-full rounded-lg bg-[#34765a] py-2.5 text-sm font-semibold text-white transition hover:bg-[#285b44]"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
