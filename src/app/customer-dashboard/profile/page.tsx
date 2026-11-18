
"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import {
  UserRound,
  Mail,
  Phone,
  MapPin,
  Save,
} from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function CustomerProfilePage() {
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
          throw new Error(
            data.message || "Failed to load profile"
          );
        }

        if (!cancelled) {
          setName(data.user?.name || user.name || "");
          setPhone(data.user?.phone || "");
          setAddress(data.user?.address || "");
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
        throw new Error(
          data.message || "Profile update failed"
        );
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
      <div className="py-20 text-center text-[#8B633E]">
        Loading your profile...
      </div>
    );
  }

  // Login Check
  if (!user) {
    return (
      <div className="py-20 text-center text-[#8B633E]">
        Please login to view your profile.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <p className="text-sm font-medium text-[#A0805B]">
          CUSTOMER DASHBOARD
        </p>

        <h1 className="mt-2 text-3xl font-bold text-[#5C3D25]">
          My Profile
        </h1>

        <p className="mt-2 text-sm text-[#A0805B]">
          Manage your personal information and account details.
        </p>
      </div>

      {/* Profile Card */}
      <div className="rounded-2xl border border-[#E8D8B8] bg-white p-6 shadow-sm sm:p-8">
        {/* User Information */}
        <div className="mb-8 flex flex-col items-center gap-4 border-b border-[#F0E5D3] pb-6 sm:flex-row">
          {/* Avatar */}
          <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-[#FFF9ED] bg-[#E8D8B8]">
            {user.image?.trim() && !imageError ? (
              <Image
                src={user.image}
                alt={name || "User"}
                onError={() => setImageError(true)}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-3xl font-bold uppercase text-[#5C3D25]">
                {name.trim().charAt(0) || "U"}
              </span>
            )}
          </div>

          {/* Name and Email */}
          <div className="text-center sm:text-left">
            <h2 className="text-xl font-bold text-[#5C3D25]">
              {name || user.name || "User"}
            </h2>

            <p className="mt-1 text-sm text-[#A0805B]">
              {user.email}
            </p>

            <p className="mt-2 text-xs font-medium text-[#8B633E]">
              Customer Account
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Full Name */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-[#5C3D25]">
              Full Name
            </label>

            <div className="relative">
              <UserRound
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A0805B]"
                size={18}
              />

              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                required
                className="w-full rounded-xl border border-[#E8D8B8] bg-white py-3 pl-11 pr-4 text-sm text-[#5C3D25] outline-none focus:border-[#8B633E]"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-[#5C3D25]">
              Email Address
            </label>

            <div className="relative">
              <Mail
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A0805B]"
                size={18}
              />

              <input
                type="email"
                value={user.email || ""}
                readOnly
                className="w-full cursor-not-allowed rounded-xl border border-[#E8D8B8] bg-[#FFF9ED] py-3 pl-11 pr-4 text-sm text-[#8B633E] outline-none"
              />
            </div>

            <p className="mt-1 text-xs text-[#A0805B]">
              Email changes require verification.
            </p>
          </div>

          {/* Phone Number */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-[#5C3D25]">
              Phone Number
            </label>

            <div className="relative">
              <Phone
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A0805B]"
                size={18}
              />

              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter your phone number"
                className="w-full rounded-xl border border-[#E8D8B8] bg-white py-3 pl-11 pr-4 text-sm text-[#5C3D25] outline-none focus:border-[#8B633E]"
              />
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-[#5C3D25]">
              Address
            </label>

            <div className="relative">
              <MapPin
                className="absolute left-4 top-4 text-[#A0805B]"
                size={18}
              />

              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter your full address"
                rows={4}
                className="w-full resize-none rounded-xl border border-[#E8D8B8] bg-white py-3 pl-11 pr-4 text-sm text-[#5C3D25] outline-none focus:border-[#8B633E]"
              />
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end border-t border-[#F0E5D3] pt-6">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 rounded-xl bg-[#8B633E] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#5C3D25] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Save size={18} />
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
