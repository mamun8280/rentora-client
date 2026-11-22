
"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function PaymentSuccessPage() {
  const router = useRouter();

  useEffect(() => {
    sessionStorage.removeItem("rentoraBookingDraft");
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8faf7] px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-lg">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl text-green-600">
          ✓
        </div>

        <h1 className="mb-3 text-2xl font-bold text-gray-900">
          Payment Successful!
        </h1>

        <p className="mb-6 text-gray-600">
          Your payment was submitted successfully. Your booking confirmation
          will be available after payment verification.
        </p>

        <button
          onClick={() => router.push("/")}
          className="w-full rounded-lg bg-[#34765a] px-5 py-3 font-semibold text-white hover:bg-[#285c45]"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}
