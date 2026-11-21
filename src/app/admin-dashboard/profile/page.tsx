"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Pencil,
  UserRound,
  Mail,
  Phone,
  MapPin,
  Save,
  UploadCloud,
  Loader2,
  LogIn,
} from "lucide-react";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Profile = {
  name: string;
  email: string;
  image: string;
  phone: string;
  address: string;
};

const emptyProfile: Profile = {
  name: "",
  email: "",
  image: "",
  phone: "",
  address: "",
};

export default function AdminProfilePage() {
  const { data: session, isPending } = authClient.useSession();

  const [profile, setProfile] = useState<Profile>(emptyProfile);
  const [form, setForm] = useState<Profile>(emptyProfile);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [profileImageError, setProfileImageError] = useState(false);
  const [previewImageError, setPreviewImageError] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);

  const email = session?.user?.email || "";

  // Get Profile
  useEffect(() => {
    if (isPending || !email) return;

    let cancelled = false;

    const fetchProfile = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/profile/${encodeURIComponent(email)}`
        );

        if (!res.ok) throw new Error("Failed to load profile");

        const data = await res.json();
        const user = data.profile || data.user || data;

        const profileData: Profile = {
          name: user.name || session?.user?.name || "",
          email: user.email || email,
          image: user.image || "",
          phone: user.phone || "",
          address: user.address || "",
        };

        if (!cancelled) {
          setProfile(profileData);
          setForm(profileData);
        }
      } catch (error) {
        console.error("Profile loading error:", error);
        if (!cancelled) toast.error("Failed to load profile");
      } finally {
        if (!cancelled) setProfileLoading(false);
      }
    };

    fetchProfile();

    return () => {
      cancelled = true;
    };
  }, [email, isPending, session?.user?.name]);

  // Handle Input Changes
  const handleChange = (field: keyof Profile, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));

    if (field === "image") {
      setPreviewImageError(false);
    }
  };

  const hasChanges =
    profile.name !== form.name ||
    profile.image !== form.image ||
    profile.phone !== form.phone ||
    profile.address !== form.address;

  // Upload Image
  const handleImageUpload = async (file?: File) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    try {
      setUploading(true);

      const res = await fetch("http://localhost:5000/api/upload-image", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      console.log("Image upload response:", data);

      if (!res.ok || !data.image) {
        throw new Error(data.message || "Image upload failed");
      }

      setForm((prev) => ({
        ...prev,
        image: data.image,
      }));

      setPreviewImageError(false);
      toast.success("Image uploaded successfully");
    } catch (error) {
      console.error("Image upload error:", error);
      toast.error(
        error instanceof Error ? error.message : "Image upload failed"
      );
    } finally {
      setUploading(false);
    }
  };

  // Update Profile
  const handleSave = async () => {
    if (!hasChanges || saving || uploading || !email) return;

    try {
      setSaving(true);

      console.log("Saving profile:", form);
      console.log("Profile API URL:", `http://localhost:5000/api/profile/${encodeURIComponent(email)}`);

      const res = await fetch(
        `http://localhost:5000/api/profile/${encodeURIComponent(email)}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: form.name,
            image: form.image,
            phone: form.phone,
            address: form.address,
          }),
        }
      );

      console.log("Profile API response status:", res.status);

      const data = await res.json();

      console.log("Profile API response data:", data);

      if (!res.ok) {
        throw new Error(data.message || "Failed to update profile");
      }

      const updatedProfile = data.profile
        ? {
            name: data.profile.name || "",
            email: data.profile.email || email,
            image: data.profile.image || "",
            phone: data.profile.phone || "",
            address: data.profile.address || "",
          }
        : { ...form };

      setProfile(updatedProfile);
      setForm(updatedProfile);
      setProfileImageError(false);
      setOpen(false);

      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Profile save error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to update profile"
      );
    } finally {
      setSaving(false);
    }
  };

  // Loading and Login Conditions
  if (isPending || profileLoading && email) {
    return (
      <div className="flex min-h-75 items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#3B2314]">
            <Loader2 size={28} className="animate-spin text-[#F5B82E]" />
          </div>
          <p className="text-sm font-medium text-[#6B4426]">
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  if (!email) {
    return (
      <div className="flex min-h-75 items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FDE9A8] text-[#3B2314]">
            <LogIn size={28} />
          </div>
          <p className="font-bold text-[#3B2314]">
            Please login to view your profile.
          </p>
        </div>
      </div>
    );
  }

  const fieldClass =
    "rounded-xl border-[#E8D5A8] bg-[#FFFDF6] text-[#3B2314] placeholder:text-[#6B4426]/40 focus-visible:border-[#F5B82E] focus-visible:ring-4 focus-visible:ring-[#F5B82E]/25";

  const labelClass = "text-sm font-bold text-[#3B2314]";

  const details = [
    {
      label: "Full Name",
      value: profile.name || "Not provided",
      icon: UserRound,
      breakAll: false,
    },
    {
      label: "Email Address",
      value: profile.email || "Not provided",
      icon: Mail,
      breakAll: true,
    },
    {
      label: "Phone Number",
      value: profile.phone || "Not provided",
      icon: Phone,
      breakAll: false,
    },
    {
      label: "Address",
      value: profile.address || "Not provided",
      icon: MapPin,
      breakAll: false,
    },
  ];

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Header */}
      <div>
        <p className="inline-flex items-center gap-2 rounded-full bg-[#F5B82E]/25 px-3 py-1 text-xs font-bold text-[#7C4A0E]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#B4651B]" />
          Admin dashboard
        </p>

        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-[#3B2314] sm:text-4xl">
          My Profile
        </h1>
        <p className="mt-2 text-sm text-[#6B4426]/80">
          Manage your personal information and account details.
        </p>
      </div>

      <Card className="overflow-hidden rounded-3xl border-0 bg-white p-0 shadow-xl shadow-[#3B2314]/5 ring-1 ring-[#EBDCB5]">
        <CardHeader className="flex flex-row items-center justify-between gap-3 border-b border-[#F0E3BF] bg-[#FFF3CF] px-5 py-4 sm:px-8">
          <div>
            <CardTitle className="text-lg font-extrabold text-[#3B2314]">
              Profile Information
            </CardTitle>
            <p className="mt-1 text-sm text-[#6B4426]/80">
              Your personal account details
            </p>
          </div>

          <Button
            size="icon"
            variant="outline"
            title="Edit Profile"
            onClick={() => {
              setForm({ ...profile });
              setProfileImageError(false);
              setPreviewImageError(false);
              setOpen(true);
            }}
            className="rounded-xl border-[#F5B82E] bg-[#F5B82E] text-[#3B2314] shadow-md shadow-[#F5B82E]/30 transition hover:bg-[#E6A515] hover:text-[#3B2314]"
          >
            <Pencil className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-8 p-5 sm:p-8">
          {/* Identity banner */}
          <div className="relative flex flex-col items-center gap-5 overflow-hidden rounded-2xl bg-[#3B2314] p-6 sm:flex-row sm:p-8">
            <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[#F5B82E]/20 blur-2xl" />
            <div className="pointer-events-none absolute -bottom-20 right-24 h-48 w-48 rounded-full bg-[#B4651B]/30 blur-3xl" />

            {profile.image && !profileImageError ? (
              <Image
                src={profile.image}
                alt={profile.name || "Profile"}
                width={100}
                height={100}
                unoptimized
                onError={() => setProfileImageError(true)}
                className="relative h-24 w-24 shrink-0 rounded-full border-4 border-[#F5B82E] object-cover shadow-lg"
              />
            ) : (
              <div className="relative flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-[#F5B82E] text-3xl font-extrabold text-[#3B2314] ring-4 ring-[#F5B82E]/30">
                {profile.name?.charAt(0).toUpperCase() || "A"}
              </div>
            )}

            <div className="relative text-center sm:text-left">
              <h2 className="text-2xl font-extrabold tracking-tight text-[#FFF3CF]">
                {profile.name || "Admin"}
              </h2>
              <p className="mt-1 break-all text-sm text-[#FDE9A8]/75">
                {profile.email}
              </p>
              <span className="mt-3 inline-block rounded-full bg-[#F5B82E] px-4 py-1.5 text-xs font-extrabold text-[#3B2314]">
                Administrator
              </span>
            </div>
          </div>

          {/* Details */}
          <div className="grid gap-4 sm:grid-cols-2">
            {details.map(({ label, value, icon: Icon, breakAll }) => (
              <div
                key={label}
                className="flex items-center gap-4 rounded-2xl border border-[#EFE1BD] bg-[#FFFCF2] p-4"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#FFF3CF] text-[#B4651B]">
                  <Icon className="h-5 w-5" />
                </div>

                <div className="min-w-0 space-y-1">
                  <Label className="text-xs font-semibold text-[#6B4426]/70">
                    {label}
                  </Label>
                  <p
                    className={`font-bold text-[#3B2314] ${
                      breakAll ? "break-all" : ""
                    }`}
                  >
                    {value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] w-[95vw] overflow-y-auto rounded-3xl border-0 bg-white p-0 shadow-2xl shadow-[#3B2314]/25 ring-1 ring-[#EBDCB5] sm:max-w-xl">
          <DialogHeader className="bg-[#3B2314] p-6 text-left">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#F5B82E] text-[#3B2314]">
                <Pencil size={22} />
              </div>

              <div>
                <DialogTitle className="text-xl font-extrabold tracking-tight text-[#FFF3CF]">
                  Edit Profile
                </DialogTitle>
                <DialogDescription className="mt-1 text-[#FDE9A8]/75">
                  Update your personal information below.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-5 p-6">
            <div className="space-y-3">
              <Label className={labelClass}>Upload Profile Image</Label>

              <label
                htmlFor="profile-image"
                className={`flex cursor-pointer items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-[#F5B82E]/70 bg-[#FFF8DF] px-4 py-5 text-sm font-bold text-[#7C4A0E] transition hover:border-[#B4651B] hover:bg-[#FFF3CF] ${
                  uploading ? "pointer-events-none opacity-60" : ""
                }`}
              >
                <UploadCloud className="h-5 w-5" />
                {uploading ? "Uploading Image..." : "Choose Image"}
              </label>

              <input
                id="profile-image"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="hidden"
                disabled={uploading}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  void handleImageUpload(file);
                  e.currentTarget.value = "";
                }}
              />

              <p className="text-xs text-[#6B4426]/70">
                JPG, PNG or WEBP. Maximum size 5MB.
              </p>
            </div>

            {form.image && (
              <div className="flex items-center gap-3 rounded-2xl bg-[#FFF3CF] p-3 ring-1 ring-[#F5D77A]">
                {!previewImageError ? (
                  <Image
                    src={form.image}
                    alt="Profile preview"
                    width={64}
                    height={64}
                    unoptimized
                    onError={() => setPreviewImageError(true)}
                    className="h-16 w-16 rounded-full border-2 border-[#F5B82E] object-cover"
                  />
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#F5B82E] text-xl font-extrabold text-[#3B2314]">
                    {form.name?.charAt(0).toUpperCase() || "A"}
                  </div>
                )}

                <p className="text-sm font-bold text-[#3B2314]">
                  Profile Image
                </p>
              </div>
            )}

            <div className="space-y-2">
              <Label className={labelClass}>Full Name</Label>
              <Input
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="Enter your name"
                className={fieldClass}
              />
            </div>

            <div className="space-y-2">
              <Label className={labelClass}>Email Address</Label>
              <Input
                type="email"
                value={form.email}
                disabled
                className="rounded-xl border-[#EFE1BD] bg-[#FFF3CF] text-[#6B4426]/70"
              />
            </div>

            <div className="space-y-2">
              <Label className={labelClass}>Phone Number</Label>
              <Input
                value={form.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                placeholder="Enter phone number"
                className={fieldClass}
              />
            </div>

            <div className="space-y-2">
              <Label className={labelClass}>Address</Label>
              <Input
                value={form.address}
                onChange={(e) => handleChange("address", e.target.value)}
                placeholder="Enter your address"
                className={fieldClass}
              />
            </div>

            <Button
              onClick={handleSave}
              disabled={!hasChanges || saving || uploading}
              className="w-full rounded-xl bg-[#F5B82E] py-6 text-base font-extrabold text-[#3B2314] shadow-md shadow-[#F5B82E]/30 transition hover:bg-[#E6A515] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Save className="mr-2 h-4 w-4" />
              {saving ? "Saving Changes..." : "Save Changes"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}