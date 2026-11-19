
"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import Image from "next/image";
import {
  PackagePlus,
  Upload,
  Loader2,
  Image as ImageIcon,
  CheckCircle,
  XCircle,
  CalendarDays,
  UserRound,
  Mail,
  Info,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY || "";
const today = new Date().toLocaleDateString("en-CA");

const SectionTitle = ({
  title,
  hint,
}: {
  title: string;
  hint?: string;
}) => (
  <div className="flex items-end justify-between gap-3 border-b border-[#F0E3BF] pb-3">
    <h2 className="flex items-center gap-3 text-lg font-extrabold text-[#3B2314]">
      <span className="h-5 w-1.5 rounded-full bg-[#F5B82E]" />
      {title}
    </h2>
    {hint && <span className="text-xs text-[#6B4426]/60">{hint}</span>}
  </div>
);

export default function EditEquipmentPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-100 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#B4651B]" />
        </div>
      }
    >
      <EditEquipmentForm />
    </Suspense>
  );
}

function EditEquipmentForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id") || "";

  const { data: session, isPending } = authClient.useSession();

  const [fetching, setFetching] = useState(() => Boolean(id));
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageStatus, setImageStatus] = useState("");

  const [formData, setFormData] = useState({
    equipmentName: "",
    description: "",
    category: "",
    location: "",
    rentalPrice: "",
    rentalType: "Daily",
    availableQuantity: "",
    availableFrom: "",
    availableUntil: "",
    condition: "",
    brand: "",
    model: "",
    image: "",
    rentalTerms: "",
  });

  // Load existing equipment
  useEffect(() => {
    if (!id) return;

    let active = true;

    const fetchEquipment = async () => {
      try {
        const response = await fetch(`${API_URL}/api/equipment/${id}`);

        if (!response.ok) {
          throw new Error("Equipment not found");
        }

        const data = await response.json();

        if (!data) {
          throw new Error("Equipment not found");
        }

        if (!active) return;

        setFormData({
          equipmentName: data.equipmentName || "",
          description: data.description || "",
          category: data.category || "",
          location: data.location || "",
          rentalPrice: String(data.rentalPrice ?? ""),
          rentalType: data.rentalType || "Daily",
          availableQuantity: String(data.availableQuantity ?? ""),
          availableFrom: data.availableFrom?.slice(0, 10) || "",
          availableUntil: data.availableUntil?.slice(0, 10) || "",
          condition: data.condition || "",
          brand: data.brand || "",
          model: data.model || "",
          image: data.image || "",
          rentalTerms: data.rentalTerms || "",
        });
      } catch {
        if (active) {
          toast.error("Failed to load equipment");
        }
      } finally {
        if (active) {
          setFetching(false);
        }
      }
    };

    fetchEquipment();

    return () => {
      active = false;
    };
  }, [id]);

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Image Upload
  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!IMGBB_API_KEY) {
      setImageStatus("error");
      toast.error("ImgBB API key is missing");
      e.target.value = "";
      return;
    }

    if (
      !["image/png", "image/jpeg"].includes(file.type) ||
      file.size > 5 * 1024 * 1024
    ) {
      setImageStatus("error");
      toast.error("Select a PNG or JPG image smaller than 5MB");
      e.target.value = "";
      return;
    }

    setUploading(true);
    setImageStatus("uploading");

    const imageData = new FormData();
    imageData.append("image", file);

    try {
      const response = await fetch(
        `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
        {
          method: "POST",
          body: imageData,
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error("Image upload failed");
      }

      setFormData((prev) => ({
        ...prev,
        image: result.data.display_url,
      }));

      setImageStatus("success");
      toast.success("Image uploaded successfully!");
    } catch {
      setImageStatus("error");
      toast.error("Image upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  // Update Equipment
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!id) {
      toast.error("Equipment ID missing");
      return;
    }

    if (uploading) {
      toast.error("Please wait for image upload");
      return;
    }

    if (!formData.image) {
      toast.error("Please upload equipment image");
      return;
    }

    if (!formData.availableFrom || !formData.availableUntil) {
      toast.error("Please select availability dates");
      return;
    }

    if (formData.availableFrom < today) {
      toast.error("Available From cannot be in the past");
      return;
    }

    if (formData.availableUntil <= formData.availableFrom) {
      toast.error("Available Until must be after Available From");
      return;
    }

    if (Number(formData.rentalPrice) <= 0) {
      toast.error("Enter a valid rental price");
      return;
    }

    if (Number(formData.availableQuantity) <= 0) {
      toast.error("Enter a valid quantity");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/equipment/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          rentalPrice: Number(formData.rentalPrice),
          availableQuantity: Number(formData.availableQuantity),
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Update failed");
      }

      toast.success("Equipment updated successfully!");
      router.push(`/owner-dashboard/my-equipment/${id}`);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Update failed"
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "mt-2 w-full rounded-xl border border-[#E8D5A8] bg-[#FFFDF6] px-4 py-3 text-sm text-[#3B2314] placeholder:text-[#6B4426]/40 outline-none transition focus:border-[#F5B82E] focus:bg-white focus:ring-4 focus:ring-[#F5B82E]/25";

  const labelClass = "text-sm font-bold text-[#3B2314]";

  if (isPending || fetching) {
    return (
      <div className="flex min-h-100 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#B4651B]" />
      </div>
    );
  }

  // Missing ID
  if (!id) {
    return (
      <div className="mx-auto max-w-md rounded-3xl bg-white p-10 text-center shadow-lg">
        <Info size={30} className="mx-auto text-[#B4651B]" />
        <h2 className="mt-4 text-xl font-bold text-[#3B2314]">
          Equipment ID missing
        </h2>
        <button
          type="button"
          onClick={() => router.push("/owner-dashboard/my-equipment")}
          className="mt-5 rounded-xl bg-[#F5B82E] px-5 py-3 font-bold text-[#3B2314]"
        >
          Back to My Equipment
        </button>
      </div>
    );
  }

  // Login Check
  if (!session?.user?.email) {
    return (
      <div className="mx-auto max-w-md rounded-3xl bg-white p-10 text-center shadow-lg">
        <UserRound size={30} className="mx-auto text-[#B4651B]" />
        <h2 className="mt-4 text-xl font-bold text-[#3B2314]">
          Please login first
        </h2>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#3B2314]">
          <PackagePlus className="h-7 w-7 text-[#F5B82E]" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-[#3B2314] sm:text-3xl">
            Edit Equipment
          </h1>
          <p className="text-sm text-[#6B4426]/80">
            Update your equipment information.
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-9 rounded-3xl bg-white p-5 shadow-xl ring-1 ring-[#EBDCB5] sm:p-9"
      >
        {/* Equipment Information */}
        <section className="space-y-5">
          <SectionTitle title="Equipment information" />

          <div>
            <label className={labelClass}>Equipment Name *</label>
            <input
              name="equipmentName"
              value={formData.equipmentName}
              onChange={handleChange}
              className={inputClass}
              required
            />
          </div>

          <div>
            <label className={labelClass}>Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className={inputClass}
              required
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={inputClass}
                required
              >
                <option value="">Select category</option>
                <option value="Construction Equipment">Construction Equipment</option>
                <option value="Agriculture Equipment">Agriculture Equipment</option>
                <option value="Power Tools">Power Tools</option>
                <option value="Hand Tools">Hand Tools</option>
                <option value="Vehicles">Vehicles</option>
                <option value="Photography Equipment">Photography Equipment</option>
                <option value="Audio & Video Equipment">Audio & Video Equipment</option>
                <option value="Event Equipment">Event Equipment</option>
                <option value="Cleaning Equipment">Cleaning Equipment</option>
                <option value="Gardening Equipment">Gardening Equipment</option>
                <option value="Electronics">Electronics</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className={labelClass}>Location *</label>
              <input
                name="location"
                value={formData.location}
                onChange={handleChange}
                className={inputClass}
                required
              />
            </div>
          </div>
        </section>

        {/* Rental Information */}
        <section className="space-y-5">
          <SectionTitle title="Rental information" />

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Rental Price (৳) *</label>
              <input
                type="number"
                name="rentalPrice"
                value={formData.rentalPrice}
                onChange={handleChange}
                min="1"
                className={inputClass}
                required
              />
            </div>

            <div>
              <label className={labelClass}>Rental Type *</label>
              <select
                name="rentalType"
                value={formData.rentalType}
                onChange={handleChange}
                className={inputClass}
                required
              >
                <option value="Daily">Daily</option>
                <option value="Weekly">Weekly</option>
                <option value="Monthly">Monthly</option>
              </select>
            </div>

            <div>
              <label className={labelClass}>Available Quantity *</label>
              <input
                type="number"
                name="availableQuantity"
                value={formData.availableQuantity}
                onChange={handleChange}
                min="1"
                className={inputClass}
                required
              />
            </div>

            <div>
              <label className={labelClass}>Equipment Condition *</label>
              <select
                name="condition"
                value={formData.condition}
                onChange={handleChange}
                className={inputClass}
                required
              >
                <option value="">Select condition</option>
                <option value="New">New</option>
                <option value="Like New">Like New</option>
                <option value="Good">Good</option>
                <option value="Fair">Fair</option>
              </select>
            </div>

            <div>
              <label className={labelClass}>Available From *</label>
              <div className="relative">
                <CalendarDays
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#B4651B]"
                />
                <input
                  type="date"
                  name="availableFrom"
                  value={formData.availableFrom}
                  onChange={handleChange}
                  min={today}
                  className={`${inputClass} pl-11`}
                  required
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>Available Until *</label>
              <div className="relative">
                <CalendarDays
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#B4651B]"
                />
                <input
                  type="date"
                  name="availableUntil"
                  value={formData.availableUntil}
                  onChange={handleChange}
                  min={formData.availableFrom || today}
                  className={`${inputClass} pl-11`}
                  required
                />
              </div>
            </div>
          </div>
        </section>

        {/* Brand Information */}
        <section className="space-y-5">
          <SectionTitle title="Brand information" hint="Optional" />

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Brand</label>
              <input
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Model</label>
              <input
                name="model"
                value={formData.model}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
          </div>
        </section>

        {/* Image Upload */}
        <section className="space-y-4">
          <SectionTitle title="Equipment image *" />

          <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#F5B82E]/70 bg-[#FFF8DF] p-6 text-center hover:bg-[#FFF3CF]">
            {formData.image ? (
              <Image
                src={formData.image}
                alt="Equipment preview"
                width={600}
                height={400}
                unoptimized
                className="mb-4 h-48 w-full rounded-xl object-contain"
              />
            ) : (
              <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-[#B4651B]">
                <ImageIcon size={32} />
              </div>
            )}

            <span className="font-bold text-[#3B2314]">
              {formData.image
                ? "Change equipment image"
                : "Choose equipment image"}
            </span>

            <span className="mt-1 text-xs text-[#6B4426]/70">
              PNG, JPG or JPEG (Maximum 5MB)
            </span>

            <span className="mt-4 flex items-center gap-2 rounded-xl bg-[#3B2314] px-5 py-2.5 text-sm font-semibold text-[#FDE9A8]">
              <Upload size={16} />
              Change image
            </span>

            <input
              type="file"
              accept="image/png,image/jpeg"
              onChange={handleImageUpload}
              disabled={uploading}
              className="hidden"
            />
          </label>

          {uploading && (
            <div className="flex items-center gap-2 rounded-xl bg-[#FDE9A8] p-3 text-sm text-[#7C4A0E]">
              <Loader2 size={20} className="animate-spin" />
              Uploading image...
            </div>
          )}

          {imageStatus === "success" && (
            <div className="flex items-center gap-2 rounded-xl bg-[#ECF6D8] p-3 text-sm text-[#3F6212]">
              <CheckCircle size={20} />
              Image uploaded successfully!
            </div>
          )}

          {imageStatus === "error" && (
            <div className="flex items-center gap-2 rounded-xl bg-[#FDE4DC] p-3 text-sm text-[#9A3412]">
              <XCircle size={20} />
              Image upload failed. Please try again.
            </div>
          )}
        </section>

        {/* Rental Terms */}
        <section className="space-y-4">
          <SectionTitle title="Rental terms and conditions" hint="Optional" />
          <textarea
            name="rentalTerms"
            value={formData.rentalTerms}
            onChange={handleChange}
            rows={4}
            className={inputClass}
          />
        </section>

        {/* Owner Information */}
        <section className="space-y-4">
          <SectionTitle title="Owner information" />

          <div className="grid gap-4 rounded-2xl bg-[#FFF3CF] p-5 sm:grid-cols-2">
            <div className="flex items-center gap-3">
              <UserRound className="text-[#B4651B]" />
              <div>
                <p className="text-xs text-[#6B4426]/70">Owner name</p>
                <p className="text-sm font-bold text-[#3B2314]">
                  {session?.user?.name || "Equipment Owner"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Mail className="text-[#B4651B]" />
              <div>
                <p className="text-xs text-[#6B4426]/70">Owner email</p>
                <p className="break-all text-sm font-bold text-[#3B2314]">
                  {session?.user?.email}
                </p>
              </div>
            </div>
          </div>

          <p className="flex items-center gap-2 text-xs text-[#6B4426]/70">
            <Info size={14} />
            Your owner information remains connected to your account.
          </p>
        </section>

        {/* Status */}
        <div className="flex items-center justify-between gap-4 rounded-2xl bg-[#3B2314] p-5">
          <div>
            <p className="font-bold text-[#FDE9A8]">Equipment status</p>
            <p className="text-xs text-[#FDE9A8]/70">
              Current approval status
            </p>
          </div>

          <span className="rounded-full bg-[#F5B82E] px-4 py-2 text-sm font-bold text-[#3B2314]">
            Existing status is preserved
          </span>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading || uploading}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#F5B82E] px-6 py-4 font-extrabold text-[#3B2314] shadow-lg transition hover:bg-[#E6A515] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              Updating equipment...
            </>
          ) : (
            <>
              <PackagePlus size={20} />
              Update Equipment
            </>
          )}
        </button>
      </form>
    </div>
  );
}
