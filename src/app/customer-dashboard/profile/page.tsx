
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Camera,
  Pencil,
  Loader2,
  Save,
  X,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

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

async function getAuthToken(): Promise<string> {
  const { data, error } = await authClient.token();

  if (error || !data?.token) {
    throw new Error("Authentication token not found. Please login again.");
  }

  return data.token;
}

export default function CustomerProfilePage() {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const [profile, setProfile] = useState<Profile>(emptyProfile);
  const [form, setForm] = useState<Profile>(emptyProfile);

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [profileImageError, setProfileImageError] = useState(false);
  const [previewImageError, setPreviewImageError] = useState(false);

  // GET PROFILE
  useEffect(() => {
    if (isPending || !user?.email) return;

    let cancelled = false;

    const fetchProfile = async () => {
      try {
        const token = await getAuthToken();

        const res = await fetch(
          `${API_URL}/api/profile/${encodeURIComponent(user.email)}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error("Failed to load profile");
        }

        const data = await res.json();

        if (cancelled) return;

        const savedProfile = data.profile || data.user || data;

        const loadedProfile: Profile = {
          name: savedProfile.name || user.name || "",
          email: user.email,
          image: savedProfile.image || user.image || "",
          phone: savedProfile.phone || "",
          address: savedProfile.address || "",
        };

        setProfile(loadedProfile);
        setForm(loadedProfile);
        setProfileImageError(false);
      } catch (error) {
        if (cancelled) return;

        console.error(error);

        const fallbackProfile: Profile = {
          name: user.name || "",
          email: user.email,
          image: user.image || "",
          phone: "",
          address: "",
        };

        setProfile(fallbackProfile);
        setForm(fallbackProfile);

        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to load profile"
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void fetchProfile();

    return () => {
      cancelled = true;
    };
  }, [user?.email, user?.name, user?.image, isPending]);

  // CHECK CHANGES
  const hasChanges =
    profile.name !== form.name ||
    profile.image !== form.image ||
    profile.phone !== form.phone ||
    profile.address !== form.address;

  // FORM CHANGE
  const handleChange = (field: keyof Profile, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // OPEN EDIT DIALOG
  const handleOpenEdit = () => {
    setForm(profile);
    setPreviewImageError(false);
    setOpen(true);
  };

  // IMAGE UPLOAD
  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image");
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      e.target.value = "";
      return;
    }

    try {
      setUploading(true);

      const token = await getAuthToken();

      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch(`${API_URL}/api/upload-image`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

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
      console.error(error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Image upload failed"
      );
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  // SAVE PROFILE
  const handleSave = async () => {
    if (!user?.email || !hasChanges || saving || uploading) return;

    try {
      setSaving(true);

      const token = await getAuthToken();

      const res = await fetch(
        `${API_URL}/api/profile/${encodeURIComponent(user.email)}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: form.name,
            image: form.image,
            phone: form.phone,
            address: form.address,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok || data.success === false) {
        throw new Error(data.message || "Profile update failed");
      }

      const updatedProfile: Profile = {
        ...form,
        email: user.email,
      };

      setProfile(updatedProfile);
      setForm(updatedProfile);

      setProfileImageError(false);
      setPreviewImageError(false);

      setOpen(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error(error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update profile"
      );
    } finally {
      setSaving(false);
    }
  };

  // LOADING
  if (isPending) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#5C3D25]" />
      </div>
    );
  }

  // LOGIN CHECK
  if (!user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-lg font-medium text-[#5C3D25]">
          Please login to view your profile.
        </p>
      </div>
    );
  }

  // PROFILE LOADING
  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#5C3D25]" />
      </div>
    );
  }

  const avatarLetter = (
    profile.name?.trim()?.charAt(0) || "U"
  ).toUpperCase();

  return (
    <div className="min-h-screen bg-[#FFF9ED] px-4 py-8 md:px-8">
      <div className="mx-auto max-w-5xl">

        {/* HEADING */}
        <div className="mb-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[3px] text-[#A0805B]">
            Account Settings
          </p>

          <h1 className="text-3xl font-bold text-[#3B2314] md:text-4xl">
            My Profile
          </h1>

          <p className="mt-2 text-sm text-[#8B7355]">
            Manage your personal information and account details.
          </p>
        </div>

        {/* PROFILE CARD */}
        <div className="overflow-hidden rounded-2xl border border-[#E8D8B8] bg-white shadow-sm">

          {/* PROFILE BANNER */}
          <div className="bg-[#3B2314] px-6 py-8 md:px-10">
            <div className="flex flex-col items-center gap-5 sm:flex-row">

              {/* PROFILE IMAGE */}
              <div className="relative flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-[#F5B82E] bg-[#FFF3CF] text-4xl font-bold text-[#5C3D25]">
                {profile.image && !profileImageError ? (
                  <Image
                    src={profile.image}
                    alt="Profile"
                    fill
                    unoptimized
                    className="object-cover"
                    onError={() => setProfileImageError(true)}
                  />
                ) : (
                  avatarLetter
                )}
              </div>

              <div className="text-center sm:text-left">
                <h2 className="text-2xl font-bold text-white">
                  {profile.name || "Customer"}
                </h2>

                <p className="mt-1 text-sm text-[#E8D8B8]">
                  {profile.email}
                </p>

                <span className="mt-3 inline-block rounded-full bg-[#F5B82E] px-4 py-1 text-xs font-bold text-[#3B2314]">
                  Customer Account
                </span>
              </div>

              <div className="sm:ml-auto">
                <Button
                  onClick={handleOpenEdit}
                  className="bg-[#F5B82E] font-semibold text-[#3B2314] hover:bg-[#E5A91D]"
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit Profile
                </Button>
              </div>
            </div>
          </div>

          {/* PERSONAL INFORMATION */}
          <div className="p-6 md:p-10">
            <h3 className="mb-6 text-xl font-bold text-[#3B2314]">
              Personal Information
            </h3>

            <div className="grid gap-6 md:grid-cols-2">

              {/* NAME */}
              <div className="flex items-start gap-4 rounded-xl border border-[#E8D8B8] bg-[#FFFCF5] p-5">
                <div className="rounded-lg bg-[#FFF3CF] p-3">
                  <User className="h-5 w-5 text-[#5C3D25]" />
                </div>

                <div className="min-w-0">
                  <p className="text-sm text-[#A0805B]">Full Name</p>
                  <p className="mt-1 wrap-break-word font-semibold text-[#3B2314]">
                    {profile.name || "Not provided"}
                  </p>
                </div>
              </div>

              {/* EMAIL */}
              <div className="flex items-start gap-4 rounded-xl border border-[#E8D8B8] bg-[#FFFCF5] p-5">
                <div className="rounded-lg bg-[#FFF3CF] p-3">
                  <Mail className="h-5 w-5 text-[#5C3D25]" />
                </div>

                <div className="min-w-0">
                  <p className="text-sm text-[#A0805B]">Email Address</p>
                  <p className="mt-1 break-all font-semibold text-[#3B2314]">
                    {profile.email}
                  </p>
                  <p className="mt-1 text-xs text-[#A0805B]">
                    Email cannot be changed
                  </p>
                </div>
              </div>

              {/* PHONE */}
              <div className="flex items-start gap-4 rounded-xl border border-[#E8D8B8] bg-[#FFFCF5] p-5">
                <div className="rounded-lg bg-[#FFF3CF] p-3">
                  <Phone className="h-5 w-5 text-[#5C3D25]" />
                </div>

                <div className="min-w-0">
                  <p className="text-sm text-[#A0805B]">Phone Number</p>
                  <p className="mt-1 wrap-break-word font-semibold text-[#3B2314]">
                    {profile.phone || "Not provided"}
                  </p>
                </div>
              </div>

              {/* ADDRESS */}
              <div className="flex items-start gap-4 rounded-xl border border-[#E8D8B8] bg-[#FFFCF5] p-5">
                <div className="rounded-lg bg-[#FFF3CF] p-3">
                  <MapPin className="h-5 w-5 text-[#5C3D25]" />
                </div>

                <div className="min-w-0">
                  <p className="text-sm text-[#A0805B]">Address</p>
                  <p className="mt-1 wrap-break-word font-semibold text-[#3B2314]">
                    {profile.address || "Not provided"}
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* EDIT PROFILE DIALOG */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="max-h-[90vh] overflow-y-auto border-[#E8D8B8] bg-[#FFF9ED] sm:max-w-130">

            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-[#3B2314]">
                Edit Profile
              </DialogTitle>

              <DialogDescription className="text-[#8B7355]">
                Update your personal information below.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-5 py-4">

              {/* IMAGE UPLOAD */}
              <div className="flex flex-col items-center gap-3">
                <div className="relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-4 border-[#F5B82E] bg-[#FFF3CF] text-3xl font-bold text-[#5C3D25]">
                  {form.image && !previewImageError ? (
                    <Image
                      src={form.image}
                      alt="Profile preview"
                      fill
                      unoptimized
                      className="object-cover"
                      onError={() => setPreviewImageError(true)}
                    />
                  ) : (
                    avatarLetter
                  )}
                </div>

                <Label
                  htmlFor="profile-image"
                  className="flex cursor-pointer items-center gap-2 rounded-lg bg-[#3B2314] px-4 py-2 text-sm font-medium text-white hover:bg-[#5C3D25]"
                >
                  {uploading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Camera className="h-4 w-4" />
                  )}

                  {uploading ? "Uploading..." : "Change Photo"}
                </Label>

                <Input
                  id="profile-image"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  disabled={uploading}
                  onChange={handleImageUpload}
                />

                <p className="text-xs text-[#A0805B]">
                  Maximum image size 5MB.
                </p>
              </div>

              {/* NAME */}
              <div className="space-y-2">
                <Label className="font-semibold text-[#5C3D25]">
                  Full Name
                </Label>

                <Input
                  value={form.name}
                  onChange={(e) =>
                    handleChange("name", e.target.value)
                  }
                  placeholder="Enter your full name"
                  className="border-[#E8D8B8] bg-white"
                />
              </div>

              {/* EMAIL */}
              <div className="space-y-2">
                <Label className="font-semibold text-[#5C3D25]">
                  Email Address
                </Label>

                <Input
                  value={profile.email}
                  readOnly
                  disabled
                  className="border-[#E8D8B8] bg-[#F5EFE3] text-[#8B7355]"
                />

                <p className="text-xs text-[#A0805B]">
                  Email address cannot be changed.
                </p>
              </div>

              {/* PHONE */}
              <div className="space-y-2">
                <Label className="font-semibold text-[#5C3D25]">
                  Phone Number
                </Label>

                <Input
                  value={form.phone}
                  onChange={(e) =>
                    handleChange("phone", e.target.value)
                  }
                  placeholder="Enter your phone number"
                  className="border-[#E8D8B8 bg-white"
                />
              </div>

              {/* ADDRESS */}
              <div className="space-y-2">
                <Label className="font-semibold text-[#5C3D25]">
                  Address
                </Label>

                <Textarea
                  value={form.address}
                  onChange={(e) =>
                    handleChange("address", e.target.value)
                  }
                  placeholder="Enter your address"
                  rows={3}
                  className="border-[#E8D8B8 bg-white"
                />
              </div>

            </div>

            <DialogFooter className="gap-2 sm:gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setForm(profile);
                  setPreviewImageError(false);
                  setOpen(false);
                }}
                disabled={saving || uploading}
                className="border-[#E8D8B8 text-[#5C3D25]"
              >
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>

              <Button
                type="button"
                onClick={handleSave}
                disabled={!hasChanges || saving || uploading}
                className="bg-[#5C3D25] font-semibold text-white hover:bg-[#765334] disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </DialogFooter>

          </DialogContent>
        </Dialog>

      </div>
    </div>
  );
}
