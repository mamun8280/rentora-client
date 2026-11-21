
"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import {
  UserRound,
  Mail,
  Phone,
  MapPin,
  Save,
  BadgeCheck,
  Lock,
} from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ;

const labelClass = "mb-2 block text-sm font-semibold text-[#4A2F20]";

const inputClass =
  "w-full rounded-2xl border border-[#EBDCC3] bg-[#FFFBF2] py-3.5 pl-12 pr-4 text-sm text-[#2B1810] placeholder:text-[#A8957F] outline-none transition duration-200 hover:border-[#E0C99B] focus:border-[#F5A524] focus:bg-white focus:ring-4 focus:ring-[#F5A524]/15";

const iconClass =
  "pointer-events-none absolute left-4 text-[#B08A5B]";

export default function OwnerProfilePage() {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const [imageError, setImageError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // GET Profile API
  useEffect(() => {
    if (isPending || !user?.email) return;

    let cancelled = false;

    const fetchProfile = async () => {
      try {
        const response = await fetch(
          `${API_URL}/api/profile/${encodeURIComponent(user.email)}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load profile");
        }

        if (!cancelled) {
          setName(data.user?.name || data.name || user.name || "");
          setPhone(data.user?.phone || data.phone || "");
          setAddress(data.user?.address || data.address || "");
        }
      } catch (error) {
        console.error("Profile fetch error:", error);

        if (!cancelled) {
          setName(user.name || "");

          toast.error(
            error instanceof Error
              ? error.message
              : "Failed to load profile"
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchProfile();

    return () => {
      cancelled = true;
    };
  }, [user?.email, user?.name, isPending]);

  // POST Profile API
  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!user?.email) {
      toast.error("Please login first");
      return;
    }

    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(
        `${API_URL}/api/profile/${encodeURIComponent(user.email)}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name.trim(),
            phone: phone.trim(),
            address: address.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Profile update failed");
      }

      setName(name.trim());

      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Profile update error:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
    } finally {
      setSaving(false);
    }
  };

  // Loading State
  if (isPending || (user && loading)) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24 text-[#7D6757]">
        <span className="h-10 w-10 animate-spin rounded-full border-4 border-[#FFE9A8] border-t-[#F5A524]" />
        <p className="text-sm font-medium">
          Loading your profile...
        </p>
      </div>
    );
  }

  // Login Check
  if (!user) {
    return (
      <div className="mx-auto max-w-md rounded-3xl border border-[#EBDCC3] bg-white p-10 text-center shadow-sm">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-[#FFD24A] to-[#F5A524] text-[#3A2114]">
          <Lock size={24} />
        </span>

        <p className="mt-5 font-semibold text-[#2B1810]">
          Please login to view your profile.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <span className="inline-flex items-center gap-2 rounded-full border border-[#F2D9A0] bg-[#FFF1D0] px-3.5 py-1.5 text-xs font-bold tracking-wide text-[#8A4B1E]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#F5A524]" />
          OWNER DASHBOARD
        </span>

        <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-[#2B1810] sm:text-4xl">
          My Profile
        </h1>

        <p className="mt-2 text-sm text-[#7D6757]">
          Manage your personal information and owner account details.
        </p>
      </div>

      {/* Profile Card */}
      <div className="overflow-hidden rounded-[2rem] border border-[#F0E3C8] bg-white shadow-[0_30px_70px_-35px_rgba(58,33,20,0.4)]">

        {/* Cover */}
        <div className="relative h-36 overflow-hidden bg-linear-to-br from-[#2B1810] via-[#3A2114] to-[#5A3420] sm:h-44">
          <div
            aria-hidden
            className="absolute -right-16 -top-20 h-64 w-64 rounded-full border-36 border-[#F5A524]/20"
          />
          <div
            aria-hidden
            className="absolute -bottom-24 left-10 h-56 w-56 rounded-full bg-[#F5A524]/25 blur-3xl"
          />
          <div
            aria-hidden
            className="absolute right-1/3 top-4 h-28 w-28 rounded-full bg-[#FFD24A]/25 blur-3xl"
          />
        </div>

        {/* User Information */}
        <div className="relative px-6 pb-2 sm:px-10">
          <div className="-mt-14 flex flex-col items-center gap-4 sm:-mt-16 sm:flex-row sm:items-end">

            {/* Avatar */}
            <div className="rounded-full bg-linear-to-br from-[#FFD24A] to-[#F5A524] p-1.5 shadow-xl shadow-[#3A2114]/25">
              <div className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-[#FFF1D0] sm:h-32 sm:w-32">
                {user.image && !imageError ? (
                  <Image
                    src={user.image}
                    alt={name || "Owner"}
                    width={128}
                    height={128}
                    unoptimized
                    onError={() => setImageError(true)}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-4xl font-extrabold uppercase text-[#a34f22]">
                    {name.trim().charAt(0) || "O"}
                  </span>
                )}
              </div>
            </div>

            {/* Name and Email */}
            <div className="pb-1 text-center sm:text-left">
              <h2 className="text-2xl font-extrabold tracking-tight text-[#e74f0e]">
                {name || user.name || "Owner"}
              </h2>

              <p className="mt-1 text-sm text-[#7D6757]">
                {user.email}
              </p>

              <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[#FFF1D0] px-3 py-1 text-xs font-bold text-[#8A4B1E] ring-1 ring-[#F2D9A0]">
                <BadgeCheck size={14} className="text-[#E0900F]" />
                Owner Account
              </span>
            </div>
          </div>
        </div>

        {/* Profile Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-6 p-6 sm:p-10"
        >
          <div className="grid gap-6 md:grid-cols-2">

            {/* Full Name */}
            <div>
              <label htmlFor="name" className={labelClass}>
                Full Name
              </label>

              <div className="relative flex items-center">
                <UserRound className={iconClass} size={18} />

                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  required
                  className={inputClass}
                />
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label htmlFor="phone" className={labelClass}>
                Phone Number
              </label>

              <div className="relative flex items-center">
                <Phone className={iconClass} size={18} />

                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter your phone number"
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className={labelClass}>
              Email Address
            </label>

            <div className="relative flex items-center">
              <Mail className={iconClass} size={18} />

              <input
                id="email"
                type="email"
                value={user.email || ""}
                readOnly
                className="w-full cursor-not-allowed rounded-2xl border border-dashed border-[#E6D5B5] bg-[#FBF4E4] py-3.5 pl-12 pr-12 text-sm text-[#8B735F] outline-none"
              />

              <Lock
                className="pointer-events-none absolute right-4 text-[#C9B08A]"
                size={16}
              />
            </div>

            <p className="mt-2 text-xs text-[#A8957F]">
              Email changes require verification.
            </p>
          </div>

          {/* Address */}
          <div>
            <label htmlFor="address" className={labelClass}>
              Address
            </label>

            <div className="relative">
              <MapPin
                className="pointer-events-none absolute left-4 top-4 text-[#B08A5B]"
                size={18}
              />

              <textarea
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter your full address"
                rows={4}
                className={`${inputClass} resize-none`}
              />
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end border-t border-[#F0E3C8] pt-6">
            <button
              type="submit"
              disabled={saving}
              className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-linear-to-r from-[#3A2114] to-[#5A3420] py-2.5 pl-7 pr-2.5 text-sm font-semibold text-white shadow-[0_16px_36px_-14px_rgba(58,33,20,0.7)] outline-none transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_44px_-12px_rgba(58,33,20,0.8)] focus-visible:ring-4 focus-visible:ring-[#F5A524]/40 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
            >
              <span
                aria-hidden
                className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-[#FFD66B]/30 to-transparent transition-transform duration-700 group-hover:translate-x-full"
              />

              <span className="relative">
                {saving ? "Saving..." : "Save Changes"}
              </span>

              <span className="relative flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-[#FFD24A] to-[#F5A524] text-[#3A2114]">
                {saving ? (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#3A2114]/30 border-t-[#3A2114]" />
                ) : (
                  <Save size={18} />
                )}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
