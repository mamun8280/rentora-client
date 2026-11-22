
"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  CreditCard,
  MapPin,
  Package,
  Phone,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface BookingData {
  equipmentId: string;
  equipmentName: string;
  startDate: string;
  endDate: string;
  requiredQuantity: number;
  contactNumber: string;
  deliveryAddress: string;
  notes: string;
  rentalDuration: number;
  rentalPrice: number;
  rentalType: string;
  rentalUnits: number;
  bookingAmount: number;
  customerName: string;
  customerEmail: string;
}

// Read booking information from sessionStorage
const subscribe = (callback: () => void) => {
  window.addEventListener("storage", callback);

  return () => {
    window.removeEventListener("storage", callback);
  };
};

const getSnapshot = () => {
  return sessionStorage.getItem("rentoraBookingDraft");
};

const getServerSnapshot = () => null;

export default function PaymentPage() {
  const router = useRouter();

  const savedBooking = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  const booking = useMemo<BookingData | null>(() => {
    if (!savedBooking) return null;

    try {
      return JSON.parse(savedBooking) as BookingData;
    } catch {
      return null;
    }
  }, [savedBooking]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Start Stripe Checkout
  const handlePayment = async () => {
    if (!booking) return;

    if (!API_URL) {
      setError("Backend API URL is not configured.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/api/bookings/checkout`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(booking),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to start payment."
        );
      }

      if (!data.checkoutUrl) {
        throw new Error("Stripe Checkout URL was not returned.");
      }

      window.location.assign(data.checkoutUrl);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );

      setLoading(false);
    }
  };

  // No booking found
  if (!booking) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#FFFDF6] px-5 text-center">
        <Package size={48} className="text-[#B4651B]" />

        <h1 className="text-2xl font-extrabold text-[#3B2314]">
          No Booking Found
        </h1>

        <p className="max-w-md text-sm text-[#6B4426]">
          Please select your equipment and complete the booking
          form first.
        </p>

        <Button
          onClick={() => router.back()}
          className="bg-[#F5B82E] font-bold text-[#3B2314] hover:bg-[#E6A515]"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#FFFDF6] px-4 py-10">
      <div className="mx-auto max-w-5xl">

        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="mb-7 flex items-center gap-2 font-semibold text-[#6B4426] transition hover:text-[#B4651B]"
        >
          <ArrowLeft size={18} />
          Back to Booking
        </button>

        {/* Page Heading */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F5B82E] text-[#3B2314]">
            <CreditCard size={30} />
          </div>

          <h1 className="text-3xl font-extrabold text-[#3B2314] sm:text-4xl">
            Complete Your Payment
          </h1>

          <p className="mt-2 text-[#6B4426]">
            Review your rental details before proceeding to payment.
          </p>
        </div>

        <div className="grid gap-7 lg:grid-cols-5">

          {/* Booking Information */}
          <div className="space-y-6 lg:col-span-3">

            <div className="rounded-3xl border border-[#EBDCB5] bg-white p-6 shadow-sm">
              <h2 className="mb-5 flex items-center gap-2 text-xl font-extrabold text-[#3B2314]">
                <Package className="text-[#B4651B]" size={21} />
                Booking Information
              </h2>

              <h3 className="text-2xl font-extrabold text-[#3B2314]">
                {booking.equipmentName}
              </h3>

              <div className="mt-5 space-y-4">

                <div className="flex items-center gap-3 text-sm text-[#6B4426]">
                  <CalendarDays
                    size={19}
                    className="shrink-0 text-[#B4651B]"
                  />

                  <div>
                    <p className="font-bold text-[#3B2314]">
                      Rental Period
                    </p>
                    <p>
                      {booking.startDate} to {booking.endDate}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-sm text-[#6B4426]">
                  <Package
                    size={19}
                    className="shrink-0 text-[#B4651B]"
                  />

                  <div>
                    <p className="font-bold text-[#3B2314]">
                      Quantity
                    </p>
                    <p>{booking.requiredQuantity} item(s)</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-sm text-[#6B4426]">
                  <Phone
                    size={19}
                    className="shrink-0 text-[#B4651B]"
                  />

                  <div>
                    <p className="font-bold text-[#3B2314]">
                      Contact Number
                    </p>
                    <p>{booking.contactNumber}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-sm text-[#6B4426]">
                  <MapPin
                    size={19}
                    className="shrink-0 text-[#B4651B]"
                  />

                  <div>
                    <p className="font-bold text-[#3B2314]">
                      Delivery Address
                    </p>
                    <p>{booking.deliveryAddress}</p>
                  </div>
                </div>

              </div>
            </div>

            {/* Customer Information */}
            <div className="rounded-3xl border border-[#EBDCB5] bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-extrabold text-[#3B2314]">
                Customer Information
              </h2>

              <p className="text-sm text-[#6B4426]">
                <span className="font-bold text-[#3B2314]">
                  Name:{" "}
                </span>
                {booking.customerName}
              </p>

              <p className="mt-2 text-sm text-[#6B4426]">
                <span className="font-bold text-[#3B2314]">
                  Email:{" "}
                </span>
                {booking.customerEmail}
              </p>
            </div>

          </div>

          {/* Payment Summary */}
          <div className="h-fit rounded-3xl border border-[#EBDCB5] bg-white p-6 shadow-sm lg:col-span-2">

            <h2 className="mb-6 text-xl font-extrabold text-[#3B2314]">
              Payment Summary
            </h2>

            <div className="space-y-4 text-sm">

              <div className="flex justify-between gap-3 text-[#6B4426]">
                <span>Rental Price</span>

                <span className="font-bold text-[#3B2314]">
                  ৳{booking.rentalPrice.toLocaleString()} /{" "}
                  {booking.rentalType}
                </span>
              </div>

              <div className="flex justify-between text-[#6B4426]">
                <span>Rental Duration</span>

                <span className="font-bold text-[#3B2314]">
                  {booking.rentalDuration} days
                </span>
              </div>

              <div className="flex justify-between text-[#6B4426]">
                <span>Rental Units</span>

                <span className="font-bold text-[#3B2314]">
                  {booking.rentalUnits}
                </span>
              </div>

              <div className="flex justify-between text-[#6B4426]">
                <span>Quantity</span>

                <span className="font-bold text-[#3B2314]">
                  {booking.requiredQuantity}
                </span>
              </div>

            </div>

            <div className="my-6 border-t border-dashed border-[#E8D5A8]" />

            <div className="flex items-center justify-between gap-3">
              <span className="font-bold text-[#3B2314]">
                Total Amount
              </span>

              <span className="text-2xl font-extrabold text-[#B4651B]">
                ৳{booking.bookingAmount.toLocaleString()}
              </span>
            </div>

            {/* Error Message */}
            {error && (
              <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm font-medium text-red-600">
                {error}
              </p>
            )}

            {/* Pay Now */}
            <Button
              onClick={handlePayment}
              disabled={loading}
              className="mt-7 w-full rounded-xl bg-[#F5B82E] py-6 text-base font-extrabold text-[#3B2314] shadow-md shadow-[#F5B82E]/30 transition hover:bg-[#E6A515] disabled:opacity-60"
            >
              <CreditCard className="mr-2 h-5 w-5" />

              {loading
                ? "Redirecting to Stripe..."
                : "Pay Now"}
            </Button>

            <div className="mt-5 flex items-center justify-center gap-2 text-xs text-[#6B4426]/80">
              <ShieldCheck size={16} />
              Secure payment powered by Stripe
            </div>

            <p className="mt-3 text-center text-xs text-[#6B4426]/70">
              You will be redirected to Stripe Checkout to complete
              your payment.
            </p>

          </div>
        </div>
      </div>
    </main>
  );
}
