
"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import {
  CalendarDays,
  PackageSearch,
  Loader2,
  Users,
  ArrowRight,
} from "lucide-react";
import Image from "next/image";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface Booking {
  _id: string;
  customerName: string;
  customerEmail: string;
  customerImage?: string;
  equipmentName: string;
  equipmentImage?: string;
  rentalStartDate: string;
  rentalEndDate: string;
  requiredQuantity: number;
  bookingAmount: number;
  paymentStatus: string;
  bookingStatus: string;
}

const statusStyle = (status: string) => {
  const value = (status || "").toLowerCase();

  if (
    ["paid", "approved", "confirmed", "completed"].some((s) =>
      value.includes(s),
    )
  ) {
    return "bg-[#ECF6D8] text-[#3F6212]";
  }

  if (
    ["reject", "cancel", "failed", "refund"].some((s) =>
      value.includes(s),
    )
  ) {
    return "bg-[#FDE4DC] text-[#9A3412]";
  }

  return "bg-[#FDE9A8] text-[#7C4A0E]";
};

const StatusChip = ({ status }: { status: string }) => (
  <span
    className={`inline-flex rounded-full px-3 py-1.5 text-xs font-bold ${statusStyle(status)}`}
  >
    {status || "Pending"}
  </span>
);

export default function MyEquipmentRentalsPage() {
  const { data: session, isPending } = authClient.useSession();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);

  const email = session?.user?.email;

  useEffect(() => {
    if (isPending || !email) return;

    let active = true;

    const fetchBookings = async () => {
      try {
        setLoading(true);

        // Get JWT token from Better Auth
        const { data: tokenData, error: tokenError } =
          await authClient.token();

        if (tokenError || !tokenData?.token) {
          throw new Error(
            "Authentication token not found. Please login again.",
          );
        }

        const response = await fetch(
          `${API_URL}/api/bookings/owner/${encodeURIComponent(email)}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${tokenData.token}`,
            },
          },
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Failed to load bookings");
        }

        if (active) {
          setBookings(data.bookings || []);
        }
      } catch (error) {
        if (active) {
          toast.error(
            error instanceof Error
              ? error.message
              : "Failed to load equipment rentals",
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchBookings();

    return () => {
      active = false;
    };
  }, [email, isPending]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <p className="inline-flex items-center gap-2 rounded-full bg-[#F5B82E]/25 px-3 py-1 text-xs font-bold text-[#7C4A0E]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#B4651B]" />
          Owner dashboard
        </p>

        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-[#3B2314] sm:text-4xl">
          My Equipment Rentals
        </h1>

        <p className="mt-2 text-sm text-[#6B4426]/80">
          View all customer bookings for your equipment.
        </p>
      </div>

      {/* Booking Table */}
      <div className="overflow-hidden rounded-3xl bg-white shadow-xl shadow-[#3B2314]/5 ring-1 ring-[#EBDCB5]">
        <div className="flex items-center justify-between gap-3 border-b border-[#F0E3BF] px-5 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#3B2314] text-[#F5B82E]">
              <PackageSearch size={20} />
            </div>

            <h2 className="text-lg font-extrabold text-[#3B2314]">
              Rental Bookings
            </h2>
          </div>

          {!loading && bookings.length > 0 && (
            <span className="rounded-full bg-[#FFF3CF] px-3 py-1 text-xs font-bold text-[#7C4A0E]">
              {bookings.length} Bookings
            </span>
          )}
        </div>

        {isPending || loading ? (
          <div className="flex flex-col items-center py-20 text-center">
            <Loader2 size={32} className="animate-spin text-[#B4651B]" />
            <p className="mt-3 text-sm font-medium text-[#6B4426]">
              Loading bookings...
            </p>
          </div>
        ) : !email ? (
          <div className="flex flex-col items-center py-20 text-center">
            <Users size={36} className="text-[#B4651B]" />
            <p className="mt-4 font-bold text-[#3B2314]">
              Please login to view your bookings.
            </p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="flex flex-col items-center px-4 py-20 text-center">
            <CalendarDays size={40} className="text-[#B4651B]" />

            <p className="mt-4 text-lg font-extrabold text-[#3B2314]">
              No bookings found
            </p>

            <p className="mt-2 text-sm text-[#6B4426]/80">
              Customer bookings for your equipment will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-275 text-left">
              <thead className="bg-[#FFF3CF] text-xs font-bold text-[#6B4426]">
                <tr>
                  <th className="px-5 py-4">Customer Information</th>
                  <th className="px-5 py-4">Equipment Information</th>
                  <th className="px-5 py-4">Rental Duration</th>
                  <th className="px-5 py-4">Required Quantity</th>
                  <th className="px-5 py-4">Booking Amount</th>
                  <th className="px-5 py-4">Payment Status</th>
                  <th className="px-5 py-4">Booking Status</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#F5EBCF]">
                {bookings.map((booking) => (
                  <tr
                    key={booking._id}
                    className="transition hover:bg-[#FFFBEB]"
                  >
                    {/* Customer Information */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {booking.customerImage ? (
                          <Image
                            src={booking.customerImage}
                            alt={booking.customerName}
                            width={44}
                            height={44}
                            unoptimized
                            className="h-11 w-11 rounded-full object-cover"
                          />
                        ) : (
                          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#FDE9A8] text-[#7C4A0E]">
                            <Users size={19} />
                          </div>
                        )}

                        <div>
                          <p className="font-bold text-[#3B2314]">
                            {booking.customerName}
                          </p>
                          <p className="text-xs text-[#6B4426]">
                            {booking.customerEmail}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Equipment Information */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {booking.equipmentImage ? (
                          <Image
                            src={booking.equipmentImage}
                            alt={booking.equipmentName}
                            width={48}
                            height={48}
                            unoptimized
                            className="h-12 w-12 rounded-xl object-cover"
                          />
                        ) : (
                          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#FDE9A8]">
                            <PackageSearch size={20} />
                          </div>
                        )}

                        <span className="font-bold text-[#3B2314]">
                          {booking.equipmentName}
                        </span>
                      </div>
                    </td>

                    {/* Rental Duration */}
                    <td className="px-5 py-4 text-sm text-[#6B4426]">
                      <span className="inline-flex items-center gap-2 rounded-lg bg-[#FFF8DF] px-3 py-2">
                        {booking.rentalStartDate}
                        <ArrowRight size={14} />
                        {booking.rentalEndDate}
                      </span>
                    </td>

                    {/* Quantity */}
                    <td className="px-5 py-4 text-sm font-semibold text-[#3B2314]">
                      {booking.requiredQuantity}
                    </td>

                    {/* Amount */}
                    <td className="px-5 py-4 text-sm font-extrabold text-[#B4651B]">
                      ৳{booking.bookingAmount}
                    </td>

                    {/* Payment Status */}
                    <td className="px-5 py-4">
                      <StatusChip status={booking.paymentStatus} />
                    </td>

                    {/* Booking Status */}
                    <td className="px-5 py-4">
                      <StatusChip status={booking.bookingStatus} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
