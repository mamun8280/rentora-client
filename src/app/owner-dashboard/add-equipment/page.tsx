"use client";

import { useState } from "react";
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
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY || "";

const today = new Date().toLocaleDateString("en-CA");

export default function AddEquipmentPage() {
  const { data: session, isPending } = authClient.useSession();

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
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

  // Handle Input Change
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Image Upload using ImgBB
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!IMGBB_API_KEY) {
      setImageStatus("error");
      toast.error("ImgBB API key is missing");
      e.target.value = "";
      return;
    }

    if (!file.type.startsWith("image/")) {
      setImageStatus("error");
      toast.error("Please select a valid image");
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setImageStatus("error");
      toast.error("Image must be less than 5MB");
      e.target.value = "";
      return;
    }

    setUploading(true);
    setImageStatus("uploading");
    setImagePreview("");

    setFormData((prev) => ({
      ...prev,
      image: "",
    }));

    const imageData = new FormData();
    imageData.append("image", file);

    try {
      const response = await fetch(
        `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
        {
          method: "POST",
          body: imageData,
        },
      );

      const result = await response.json();

      console.log("ImgBB Response:", result);

      if (!response.ok || !result.success) {
        throw new Error(result.error?.message || "Image upload failed");
      }

      const imageUrl = result.data.display_url;

      setFormData((prev) => ({
        ...prev,
        image: imageUrl,
      }));

      setImagePreview(imageUrl);
      setImageStatus("success");

      toast.success("Image uploaded successfully!");
    } catch (error) {
      console.error("Image Upload Error:", error);

      setImageStatus("error");

      toast.error(
        error instanceof Error ? error.message : "Image upload failed",
      );
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  // Reset Form
  const resetForm = () => {
    setFormData({
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

    setImagePreview("");
    setImageStatus("");
  };

  // Submit Equipment
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!session?.user?.email) {
      toast.error("Please login first");
      return;
    }

    if (uploading) {
      toast.error("Please wait until image upload finishes");
      return;
    }

    if (!formData.image) {
      toast.error("Please upload equipment image first");
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
      toast.error("Please enter a valid rental price");
      return;
    }

    if (Number(formData.availableQuantity) <= 0) {
      toast.error("Please enter a valid available quantity");
      return;
    }

    setLoading(true);

    const equipmentData = {
      ...formData,
      rentalPrice: Number(formData.rentalPrice),
      availableQuantity: Number(formData.availableQuantity),
      ownerEmail: session.user.email,
      ownerName: session.user.name || "",
      status: "Pending",
      createdAt: new Date().toISOString(),
    };

    try {
      const response = await fetch(`${API_URL}/api/equipment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(equipmentData),
      });

      const result = await response.json();

      console.log("Equipment API Response:", result);

      if (!response.ok) {
        toast.error(result.message || "Equipment could not be added");
        return;
      }

      toast.success("Equipment added successfully!");

      resetForm();
    } catch (error) {
      console.error("Equipment Submit Error:", error);
      toast.error("Server connection failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (isPending) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#8B633E]" />
      </div>
    );
  }

  if (!session?.user?.email) {
    return (
      <div className="rounded-xl bg-white p-8 text-center shadow-sm">
        <h2 className="text-xl font-bold text-[#5C3D25]">Please Login First</h2>
      </div>
    );
  }

  const inputClass =
    "mt-2 w-full rounded-lg border border-[#E8D8B8] bg-white px-4 py-3 text-sm text-[#5C3D25] outline-none transition focus:border-[#8B633E] focus:ring-2 focus:ring-[#8B633E]/10";

  const labelClass = "text-sm font-semibold text-[#5C3D25]";

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-[#E8D8B8] p-3">
          <PackagePlus className="h-6 w-6 text-[#5C3D25]" />
        </div>

        <div>
          <h1 className="text-2xl font-bold text-[#5C3D25]">
            Add New Equipment
          </h1>

          <p className="text-sm text-[#A0805B]">
            Add your equipment and make it available for rental.
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-7 rounded-2xl border border-[#E8D8B8] bg-white p-5 shadow-sm sm:p-8"
      >
        {/* Equipment Information */}
        <section className="space-y-5">
          <h2 className="border-b border-[#E8D8B8] pb-3 text-lg font-bold text-[#5C3D25]">
            Equipment Information
          </h2>

          <div>
            <label className={labelClass}>Equipment Name *</label>

            <input
              name="equipmentName"
              value={formData.equipmentName}
              onChange={handleChange}
              placeholder="Enter equipment name"
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
              placeholder="Describe your equipment..."
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
                <option value="Construction Equipment">
                  Construction Equipment
                </option>
                <option value="Agriculture Equipment">
                  Agriculture Equipment
                </option>
                <option value="Power Tools">Power Tools</option>
                <option value="Hand Tools">Hand Tools</option>
                <option value="Vehicles">Vehicles</option>
                <option value="Photography Equipment">
                  Photography Equipment
                </option>
                <option value="Audio & Video Equipment">
                  Audio & Video Equipment
                </option>
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
                placeholder="Enter equipment location"
                className={inputClass}
                required
              />
            </div>
          </div>
        </section>

        {/* Rental Information */}
        <section className="space-y-5">
          <h2 className="border-b border-[#E8D8B8] pb-3 text-lg font-bold text-[#5C3D25]">
            Rental Information
          </h2>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Rental Price (৳) *</label>

              <input
                type="number"
                name="rentalPrice"
                value={formData.rentalPrice}
                onChange={handleChange}
                placeholder="Enter rental price"
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
                placeholder="Enter quantity"
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

            {/* Available From */}
            <div>
              <label className={labelClass}>Available From *</label>

              <div className="relative">
                <CalendarDays
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A0805B]"
                />

                <input
                  type="date"
                  name="availableFrom"
                  value={formData.availableFrom}
                  onChange={handleChange}
                  min={today}
                  className={`${inputClass} pl-10`}
                  required
                />
              </div>
            </div>

            {/* Available Until */}
            <div>
              <label className={labelClass}>Available Until *</label>

              <div className="relative">
                <CalendarDays
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A0805B]"
                />

                <input
                  type="date"
                  name="availableUntil"
                  value={formData.availableUntil}
                  onChange={handleChange}
                  min={formData.availableFrom ? formData.availableFrom : today}
                  className={`${inputClass} pl-10`}
                  required
                />
              </div>
            </div>
          </div>
        </section>

        {/* Brand Information */}
        <section className="space-y-5">
          <h2 className="border-b border-[#E8D8B8] pb-3 text-lg font-bold text-[#5C3D25]">
            Brand Information
          </h2>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Brand</label>

              <input
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                placeholder="Enter brand name"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Model</label>

              <input
                name="model"
                value={formData.model}
                onChange={handleChange}
                placeholder="Enter model"
                className={inputClass}
              />
            </div>
          </div>
        </section>

        {/* Image Upload */}
        <section className="space-y-4">
          <h2 className="border-b border-[#E8D8B8] pb-3 text-lg font-bold text-[#5C3D25]">
            Equipment Image *
          </h2>

          <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#E8D8B8] bg-[#FFF9ED] p-6 text-center transition hover:border-[#8B633E]">
            {imagePreview ? (
              <Image
                src={imagePreview}
                alt="Equipment preview"
                width={600}
                height={400}
                unoptimized
                className="mb-4 h-48 w-full rounded-lg object-contain"
              />
            ) : (
              <ImageIcon className="mb-3 h-12 w-12 text-[#A0805B]" />
            )}

            <span className="font-semibold text-[#5C3D25]">
              {imagePreview ? "Image Selected" : "Choose Equipment Image"}
            </span>

            <span className="mt-1 text-xs text-[#A0805B]">
              PNG, JPG or JPEG (Maximum 5MB)
            </span>

            <span className="mt-3 flex items-center gap-2 rounded-lg bg-[#8B633E] px-5 py-2 text-sm font-semibold text-white">
              <Upload size={16} />
              Choose Image
            </span>

            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={uploading}
              className="hidden"
            />
          </label>

          {uploading && (
            <div className="flex items-center gap-2 rounded-lg bg-blue-50 p-3 text-sm text-blue-700">
              <Loader2 className="h-5 w-5 animate-spin" />
              Uploading image to ImgBB...
            </div>
          )}

          {imageStatus === "success" && (
            <div className="flex items-center gap-2 rounded-lg bg-green-50 p-3 text-sm text-green-700">
              <CheckCircle className="h-5 w-5" />
              Image uploaded successfully!
            </div>
          )}

          {imageStatus === "error" && (
            <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700">
              <XCircle className="h-5 w-5" />
              Image upload failed. Please try again.
            </div>
          )}
        </section>

        {/* Rental Terms */}
        <section>
          <h2 className="mb-4 border-b border-[#E8D8B8] pb-3 text-lg font-bold text-[#5C3D25]">
            Rental Terms and Conditions
          </h2>

          <textarea
            name="rentalTerms"
            value={formData.rentalTerms}
            onChange={handleChange}
            placeholder="Write your rental terms and conditions..."
            rows={4}
            className={inputClass}
          />
        </section>

        {/* Owner Information */}
        <section className="space-y-4">
          <h2 className="border-b border-[#E8D8B8] pb-3 text-lg font-bold text-[#5C3D25]">
            Owner Information
          </h2>

          <div className="grid gap-4 rounded-xl bg-[#FFF9ED] p-5 sm:grid-cols-2">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-[#E8D8B8] p-2">
                <UserRound className="h-5 w-5 text-[#5C3D25]" />
              </div>

              <div>
                <p className="text-xs text-[#A0805B]">Owner Name</p>

                <p className="text-sm font-semibold text-[#5C3D25]">
                  {session.user.name || "Equipment Owner"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-[#E8D8B8] p-2">
                <Mail className="h-5 w-5 text-[#5C3D25]" />
              </div>

              <div>
                <p className="text-xs text-[#A0805B]">Owner Email</p>

                <p className="break-all text-sm font-semibold text-[#5C3D25]">
                  {session.user.email}
                </p>
              </div>
            </div>
          </div>

          <p className="text-xs text-[#A0805B]">
            Your account information will be attached automatically.
          </p>
        </section>

        {/* Equipment Status */}
        <div className="flex items-center justify-between rounded-xl bg-[#FFF9ED] p-4">
          <div>
            <p className="font-semibold text-[#5C3D25]">Equipment Status</p>

            <p className="text-xs text-[#A0805B]">
              Your equipment will be reviewed by Admin.
            </p>
          </div>

          <span className="rounded-full bg-yellow-100 px-4 py-2 text-sm font-semibold text-yellow-800">
            Pending
          </span>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || uploading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#8B633E] px-6 py-3.5 font-semibold text-white transition hover:bg-[#5C3D25] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Saving Equipment...
            </>
          ) : (
            <>
              <PackagePlus size={20} />
              Add Equipment
            </>
          )}
        </button>
      </form>
    </div>
  );
}
