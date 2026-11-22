
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
  Plus,
  CheckCircle2,
  Clock3,
  LogIn,
} from "lucide-react";
import Image from "next/image";

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

const statusStyles = (status: string) => {
  if (status === "Approved")
    return { chip: "bg-[#ECF6D8] text-[#3F6212]", dot: "bg-[#65A30D]" };
  if (status === "Rejected")
    return { chip: "bg-[#FDE4DC] text-[#9A3412]", dot: "bg-[#DC4A1F]" };
  return { chip: "bg-[#FDE9A8] text-[#7C4A0E]", dot: "bg-[#E6A515]" };
};

export default function MyEquipmentPage() {
  const { data: session, isPending } = authClient.useSession();

  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const ownerEmail = session?.user?.email;

  useEffect(() => {
    if (isPending || !ownerEmail) return;

    let active = true;

    const fetchEquipment = async () => {
      try {
        setError("");

        // Get JWT token from Better Auth
        const { data: tokenData, error: tokenError } =
          await authClient.token();

        if (tokenError || !tokenData?.token) {
          throw new Error(
            "Authentication token not found. Please login again.",
          );
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/equipment/my-equipment/${encodeURIComponent(ownerEmail)}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${tokenData.token}`,
            },
          },
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Failed to load equipment");
        }

        if (active) {
          setEquipment(data.equipment || []);
        }
      } catch (error) {
        if (active) {
          setError(
            error instanceof Error ? error.message : "Something went wrong",
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchEquipment();

    return () => {
      active = false;
    };
  }, [ownerEmail, isPending]);

  const approvedCount = equipment.filter((e) => e.status === "Approved").length;
  const pendingCount = equipment.filter(
    (e) => e.status !== "Approved" && e.status !== "Rejected",
  ).length;

  const stats = [
    {
      label: "Total equipment",
      value: equipment.length,
      icon: Package,
      tone: "bg-[#3B2314] text-[#F5B82E]",
    },
    {
      label: "Approved",
      value: approvedCount,
      icon: CheckCircle2,
      tone: "bg-[#ECF6D8] text-[#3F6212]",
    },
    {
      label: "Pending review",
      value: pendingCount,
      icon: Clock3,
      tone: "bg-[#FDE9A8] text-[#7C4A0E]",
    },
  ];

  return (
    <div className="min-h-screen bg-[#FFF9EA] bg-[radial-gradient(ellipse_at_top_right,#FDE9A8_0%,transparent_45%)] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="mb-2 inline-flex items-center gap-2 rounded-full bg-[#F5B82E]/25 px-3 py-1 text-xs font-bold text-[#7C4A0E]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#B4651B]" />
              Owner dashboard
            </p>

            <h1 className="text-3xl font-extrabold tracking-tight text-[#3B2314] sm:text-4xl">
              My Equipment
            </h1>

            <p className="mt-2 text-sm text-[#6B4426]/80">
              Manage all your listed equipment in one place.
            </p>
          </div>

          <Link
            href="/owner-dashboard/add-equipment"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#F5B82E] px-5 py-3 font-bold text-[#3B2314] shadow-md transition hover:bg-[#E6A515]"
          >
            <Plus size={19} />
            Add Equipment
          </Link>
        </div>

        {/* Stats */}
        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          {stats.map(({ label, value, icon: Icon, tone }) => (
            <div
              key={label}
              className="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-[#EBDCB5]"
            >
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl ${tone}`}
              >
                <Icon size={22} />
              </div>
              <div>
                <p className="text-xs font-medium text-[#6B4426]/80">{label}</p>
                <p className="text-2xl font-extrabold text-[#3B2314]">
                  {value}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Equipment Table */}
        <div className="overflow-hidden rounded-3xl bg-white shadow-xl ring-1 ring-[#EBDCB5]">
          <div className="flex items-center gap-3 border-b border-[#F0E3BF] px-5 py-4">
            <span className="h-5 w-1.5 rounded-full bg-[#F5B82E]" />
            <h2 className="font-extrabold text-[#3B2314]">Equipment list</h2>
          </div>

          {isPending || (loading && ownerEmail) ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="mb-3 animate-spin text-[#F5B82E]" size={35} />
              <p className="text-sm text-[#6B4426]">
                Loading your equipment...
              </p>
            </div>
          ) : !ownerEmail ? (
            <div className="flex flex-col items-center py-20">
              <LogIn size={35} className="mb-4 text-[#3B2314]" />
              <p className="font-bold text-[#3B2314]">
                Please login to view your equipment.
              </p>
              <Link
                href="/login"
                className="mt-4 rounded-xl bg-[#3B2314] px-6 py-3 text-[#FDE9A8]"
              >
                Go to Login
              </Link>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center py-20">
              <p className="mb-4 text-sm text-red-600">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center gap-2 rounded-xl bg-[#3B2314] px-5 py-3 text-[#FDE9A8]"
              >
                <RefreshCw size={16} />
                Try Again
              </button>
            </div>
          ) : equipment.length === 0 ? (
            <div className="flex flex-col items-center py-20 text-center">
              <Package size={40} className="mb-4 text-[#B4651B]" />
              <h3 className="text-lg font-bold text-[#3B2314]">
                No equipment found
              </h3>
              <p className="mt-2 text-sm text-[#6B4426]">
                You haven&apos;t added any equipment yet.
              </p>
              <Link
                href="/owner-dashboard/add-equipment"
                className="mt-5 rounded-xl bg-[#F5B82E] px-6 py-3 font-bold text-[#3B2314]"
              >
                Add Equipment
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-237.5 text-left">
                <thead className="bg-[#FFF3CF]">
                  <tr className="text-xs font-bold text-[#6B4426]">
                    <th className="px-5 py-4">Equipment name</th>
                    <th className="px-5 py-4">Category</th>
                    <th className="px-5 py-4">Rental price</th>
                    <th className="px-5 py-4">Quantity</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4 text-center">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#F5EBCF]">
                  {equipment.map((item) => {
                    const s = statusStyles(item.status);

                    return (
                      <tr
                        key={item._id}
                        className="transition hover:bg-[#FFFBEB]"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <Image
                              src={
                                item.image ||
                                "/images/equipment-placeholder.png"
                              }
                              alt={item.equipmentName}
                              width={56}
                              height={56}
                              unoptimized
                              className="h-14 w-14 shrink-0 rounded-xl object-cover"
                            />
                            <span className="font-bold text-[#3B2314]">
                              {item.equipmentName}
                            </span>
                          </div>
                        </td>

                        <td className="px-5 py-4 text-sm text-[#6B4426]">
                          {item.category}
                        </td>

                        <td className="px-5 py-4 text-sm font-bold text-[#B4651B]">
                          ৳{item.rentalPrice}/{item.rentalType}
                        </td>

                        <td className="px-5 py-4 text-sm text-[#3B2314]">
                          {item.availableQuantity}
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold ${s.chip}`}
                          >
                            <span className={`h-2 w-2 rounded-full ${s.dot}`} />
                            {item.status || "Pending"}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <Link
                              href={`/owner-dashboard/my-equipment/${item._id}`}
                              title="View Details"
                              className="rounded-lg bg-[#3B2314] p-2 text-[#F5B82E] hover:bg-[#2A180D]"
                            >
                              <Eye size={17} />
                            </Link>

                            <Link
                              href={`/owner-dashboard/my-equipment/edit?id=${item._id}`}
                              title="Edit Equipment"
                              className="rounded-lg bg-[#FDE9A8] p-2 text-[#7C4A0E] hover:bg-[#F5B82E]"
                            >
                              <Pencil size={17} />
                            </Link>

                            <Link
                              href={`/owner-dashboard/my-equipment/delete?id=${item._id}`}
                              title="Delete Equipment"
                              className="rounded-lg bg-[#FDE4DC] p-2 text-[#9A3412] hover:bg-red-200"
                            >
                              <Trash2 size={17} />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <p className="mt-4 text-xs text-[#6B4426]/60">
          Showing equipment added by your account.
        </p>
      </div>
    </div>
  );
}
