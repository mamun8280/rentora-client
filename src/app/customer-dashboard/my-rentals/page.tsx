"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import {
  CalendarDays,
  PackageSearch,
  Loader2,
  LogIn,
  ArrowRight,
} from "lucide-react";
import Image from "next/image";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface Booking {
  _id: string;
  equipmentName: string;
  equipmentImage: string;
  rentalStartDate: string;
  rentalEndDate: string;
  requiredQuantity: number;
  bookingAmount: number;
  paymentStatus: string;
  bookingStatus: string;
}

// Picks chip colors from the status text (case-insensitive)
const statusStyles = (status: string) => {
  const value = (status || "").toLowerCase();

  if (
    ["paid", "approved", "confirmed", "completed", "success"].some((k) =>
      value.includes(k)
    )
  )
    return { chip: "bg-[#ECF6D8] text-[#3F6212]", dot: "bg-[#65A30D]" };

  if (
    ["reject", "cancel", "fail", "refund"].some((k) => value.includes(k))
  )
    return { chip: "bg-[#FDE4DC] text-[#9A3412]", dot: "bg-[#DC4A1F]" };

  return { chip: "bg-[#FDE9A8] text-[#7C4A0E]", dot: "bg-[#E6A515]" };
};

const StatusChip = ({ status }: { status: string }) => {
  const s = statusStyles(status);

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold ${s.chip}`}
    >
      <span className={`h-2 w-2 rounded-full ${s.dot}`} />
      {status || "Pending"}
    </span>
  );
};

export default function MyRentalsPage() {
  const { data: session, isPending } = authClient.useSession();

  const [rentals, setRentals] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);

  const email = session?.user?.email;

  useEffect(() => {
    if (isPending || !email) return;

    let active = true;

    const fetchRentals = async () => {
      try {
        setLoading(true);

        const response = await fetch(
          `${API_URL}/api/bookings/customer/${encodeURIComponent(email)}`
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error("Failed to load rentals");
        }

        if (active) {
          setRentals(data.bookings || []);
        }
      } catch {
        if (active) {
          toast.error("Failed to load rentals");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchRentals();

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
          Customer dashboard
        </p>

        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-[#3B2314] sm:text-4xl">
          My Rentals
        </h1>

        <p className="mt-2 text-sm text-[#6B4426]/80">
          Track and manage all your equipment rentals.
        </p>
      </div>

      {/* Rental history */}
      <div className="overflow-hidden rounded-3xl bg-white shadow-xl shadow-[#3B2314]/5 ring-1 ring-[#EBDCB5]">
        <div className="flex items-center justify-between gap-3 border-b border-[#F0E3BF] px-5 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#3B2314] text-[#F5B82E]">
              <PackageSearch size={20} />
            </div>
            <h2 className="text-lg font-extrabold text-[#3B2314]">
              Rental history
            </h2>
          </div>

          {!loading && rentals.length > 0 && (
            <span className="rounded-full bg-[#FFF3CF] px-3 py-1 text-xs font-bold text-[#7C4A0E]">
              {rentals.length} {rentals.length === 1 ? "rental" : "rentals"}
            </span>
          )}
        </div>

        {isPending || (loading && email) ? (
          <div className="flex flex-col items-center py-20 text-center">
            <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#3B2314]">
              <Loader2 size={28} className="animate-spin text-[#F5B82E]" />
            </div>
            <p className="text-sm font-medium text-[#6B4426]">
              Loading rentals...
            </p>
          </div>
        ) : !email ? (
          <div className="flex flex-col items-center py-20 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FDE9A8] text-[#3B2314]">
              <LogIn size={28} />
            </div>
            <p className="font-bold text-[#3B2314]">
              Please login to view your rentals.
            </p>
          </div>
        ) : rentals.length === 0 ? (
          <div className="flex flex-col items-center px-4 py-20 text-center">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-[#FDE9A8] text-[#3B2314]">
              <CalendarDays size={34} />
            </div>

            <p className="text-lg font-extrabold text-[#3B2314]">
              No rentals found
            </p>

            <p className="mt-2 max-w-sm text-sm text-[#6B4426]/80">
              Your booked equipment will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-212.5 text-left">
              <thead className="bg-[#FFF3CF] text-xs font-bold text-[#6B4426]">
                <tr>
                  <th className="px-5 py-4">Equipment</th>
                  <th className="px-5 py-4">Rental duration</th>
                  <th className="px-5 py-4">Quantity</th>
                  <th className="px-5 py-4">Booking amount</th>
                  <th className="px-5 py-4">Payment status</th>
                  <th className="px-5 py-4">Booking status</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#F5EBCF]">
                {rentals.map((rental) => (
                  <tr
                    key={rental._id}
                    className="transition hover:bg-[#FFFBEB]"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {rental.equipmentImage ? (
                          <Image
                            src={rental.equipmentImage}
                            alt={rental.equipmentName}
                            width={56}
                            height={56}
                            unoptimized
                            className="h-14 w-14 shrink-0 rounded-xl object-cover ring-2 ring-[#F5B82E]/40"
                          />
                        ) : (
                          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#FDE9A8] text-[#7C4A0E]">
                            <PackageSearch size={22} />
                          </div>
                        )}

                        <span className="font-bold text-[#3B2314]">
                          {rental.equipmentName}
                        </span>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-sm text-[#6B4426]">
                      <span className="inline-flex items-center gap-2 rounded-lg bg-[#FFF8DF] px-3 py-1.5 font-medium">
                        {rental.rentalStartDate}
                        <ArrowRight size={14} className="text-[#B4651B]" />
                        {rental.rentalEndDate}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-sm font-semibold text-[#3B2314]">
                      {rental.requiredQuantity}
                    </td>

                    <td className="px-5 py-4 text-sm font-extrabold text-[#B4651B]">
                      ৳{rental.bookingAmount}
                    </td>

                    <td className="px-5 py-4">
                      <StatusChip status={rental.paymentStatus} />
                    </td>

                    <td className="px-5 py-4">
                      <StatusChip status={rental.bookingStatus} />
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