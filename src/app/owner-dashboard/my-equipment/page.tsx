
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import {
  Package,
  Eye,
  Pencil,
  Trash2,
  Loader2,
  RefreshCw,
} from "lucide-react";
import Image from "next/image";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface Equipment {
  _id: string;
  equipmentName: string;
  image: string;
  category: string;
  rentalPrice: number;
  rentalType: string;
  availableQuantity: number;
  status: string;
}

export default function MyEquipmentPage() {
  const { data: session, isPending } = authClient.useSession();

  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const ownerEmail = session?.user?.email;

  useEffect(() => {
    if (isPending || !ownerEmail) return;

    const fetchEquipment = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/api/equipment/my-equipment/${encodeURIComponent(
            ownerEmail
          )}`
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Failed to load equipment");
        }

        setEquipment(data.equipment || []);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Something went wrong"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchEquipment();
  }, [ownerEmail, isPending]);

  return (
    <div className="min-h-screen bg-[#FFF8E7] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="mb-2 text-sm font-semibold text-[#B4651B]">
              OWNER DASHBOARD
            </p>

            <h1 className="text-3xl font-extrabold text-[#2B1810]">
              My Equipment
            </h1>

            <p className="mt-2 text-sm text-[#7D6757]">
              Manage all your listed equipment in one place.
            </p>
          </div>

          <Link
            href="/owner-dashboard/add-equipment"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-[#3A2114] to-[#5A3420] px-5 py-3 font-semibold text-white shadow-md transition hover:-translate-y-0.5"
          >
            <Package size={19} />
            Add Equipment
          </Link>
        </div>

        {/* Equipment Count */}
        <div className="mb-6 rounded-2xl border border-[#EBDCC3] bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-[#7D6757]">
            Total Equipment
          </p>

          <h2 className="mt-2 text-3xl font-extrabold text-[#2B1810]">
            {equipment.length}
          </h2>
        </div>

        {/* Equipment Table */}
        <div className="overflow-hidden rounded-2xl border border-[#EBDCC3] bg-white shadow-sm">
          <div className="border-b border-[#F0E5D3] px-5 py-4">
            <h2 className="font-bold text-[#2B1810]">
              Equipment List
            </h2>
          </div>

          {isPending || (loading && ownerEmail) ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2
                className="mb-3 animate-spin text-[#B4651B]"
                size={35}
              />
              <p className="text-sm text-[#7D6757]">
                Loading your equipment...
              </p>
            </div>
          ) : !ownerEmail ? (
            <div className="py-20 text-center">
              <p className="font-semibold text-[#2B1810]">
                Please login to view your equipment.
              </p>

              <Link
                href="/login"
                className="mt-4 inline-block font-semibold text-[#B4651B] hover:underline"
              >
                Go to Login
              </Link>
            </div>
          ) : error ? (
            <div className="py-20 text-center">
              <p className="mb-4 text-red-600">{error}</p>

              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center gap-2 rounded-lg bg-[#3A2114] px-4 py-2 text-white"
              >
                <RefreshCw size={16} />
                Try Again
              </button>
            </div>
          ) : equipment.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-4 py-20 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FFF1D0] text-[#B4651B]">
                <Package size={30} />
              </div>

              <h3 className="text-lg font-bold text-[#2B1810]">
                No Equipment Found
              </h3>

              <p className="mt-2 max-w-sm text-sm text-[#7D6757]">
                You haven&apos;t added any equipment yet. Start listing your equipment.
              </p>

              <Link
                href="/owner-dashboard/add-equipment"
                className="mt-5 rounded-xl bg-[#3A2114] px-5 py-3 font-semibold text-white transition hover:bg-[#5A3420]"
              >
                Add Your First Equipment
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-237.5 text-left">
                <thead className="bg-[#FFFBF2]">
                  <tr className="text-xs uppercase tracking-wider text-[#7D6757]">
                    <th className="px-5 py-4">Equipment Name</th>
                    <th className="px-5 py-4">Category</th>
                    <th className="px-5 py-4">Rental Price</th>
                    <th className="px-5 py-4">Quantity</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4 text-center">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#F0E5D3]">
                  {equipment.map((item) => (
                    <tr
                      key={item._id}
                      className="transition hover:bg-[#FFFBF2]"
                    >
                      {/* Equipment Image + Name */}
                      <td className="px-5 py-5">
                        <div className="flex items-center gap-3">
                          <Image
                            src={item.image || "/images/equipment-placeholder.png"}
                            alt={item.equipmentName}
                            className="h-14 w-14 shrink-0 rounded-xl border border-[#EBDCC3] object-cover"
                          />

                          <span className="font-semibold text-[#2B1810]">
                            {item.equipmentName}
                          </span>
                        </div>
                      </td>

                      <td className="px-5 py-5 text-sm text-[#7D6757]">
                        {item.category}
                      </td>

                      <td className="px-5 py-5 text-sm font-semibold text-[#2B1810]">
                        ৳{item.rentalPrice}
                        <span className="ml-1 text-xs font-normal text-[#A8957F]">
                          /{item.rentalType}
                        </span>
                      </td>

                      <td className="px-5 py-5 text-sm text-[#4A2F20]">
                        {item.availableQuantity}
                      </td>

                      <td className="px-5 py-5">
                        <span
                          className={`rounded-full px-3 py-1.5 text-xs font-bold ${
                            item.status === "Approved"
                              ? "bg-green-100 text-green-700"
                              : item.status === "Rejected"
                              ? "bg-red-100 text-red-700"
                              : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {item.status || "Pending"}
                        </span>
                      </td>

                      <td className="px-5 py-5">
                        <div className="flex items-center justify-center gap-2">
                          <Link
                            href={`/owner-dashboard/my-equipment/${item._id}`}
                            title="View Details"
                            className="rounded-lg bg-blue-50 p-2 text-blue-600 transition hover:bg-blue-100"
                          >
                            <Eye size={17} />
                          </Link>

                          <button
                            type="button"
                            disabled
                            title="Update (coming next)"
                            className="cursor-not-allowed rounded-lg bg-amber-50 p-2 text-amber-600 opacity-50"
                          >
                            <Pencil size={17} />
                          </button>

                          <button
                            type="button"
                            disabled
                            title="Delete (coming next)"
                            className="cursor-not-allowed rounded-lg bg-red-50 p-2 text-red-600 opacity-50"
                          >
                            <Trash2 size={17} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <p className="mt-4 text-xs text-[#A8957F]">
          Showing equipment added by your account.
        </p>
      </div>
    </div>
  );
}
