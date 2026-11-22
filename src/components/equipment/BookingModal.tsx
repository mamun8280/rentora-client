
"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CalendarCheck, Receipt } from "lucide-react";

interface BookingModalProps {
  equipmentId: string;
  equipmentName: string;
  rentalPrice: number;
  rentalType: string;
  availableQuantity: number;
}

export default function BookingModal({
  equipmentId,
  equipmentName,
  rentalPrice,
  rentalType,
  availableQuantity,
}: BookingModalProps) {
  const [open, setOpen] = useState(false);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [contactNumber, setContactNumber] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [notes, setNotes] = useState("");

  const today = new Date().toLocaleDateString("en-CA");

  // Calculate rental duration
  const duration =
    startDate && endDate
      ? Math.max(
          0,
          Math.ceil(
            (new Date(`${endDate}T00:00:00`).getTime() -
              new Date(`${startDate}T00:00:00`).getTime()) /
              (1000 * 60 * 60 * 24)
          )
        )
      : 0;

  // Calculate rental units
  const unit = rentalType.toLowerCase();

  const rentalUnits =
    unit === "weekly"
      ? Math.ceil(duration / 7)
      : unit === "monthly"
        ? Math.ceil(duration / 30)
        : duration;

  // Calculate total amount
  const totalPrice =
    rentalUnits * Number(quantity || 0) * rentalPrice;

  // Handle booking form
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!startDate || !endDate) {
      alert("Please select rental dates.");
      return;
    }

    if (endDate <= startDate) {
      alert("End date must be after start date.");
      return;
    }

    if (
      Number(quantity) < 1 ||
      Number(quantity) > availableQuantity
    ) {
      alert(`Available quantity is ${availableQuantity}.`);
      return;
    }

    if (!contactNumber.trim() || !deliveryAddress.trim()) {
      alert("Please complete all required fields.");
      return;
    }

    const bookingData = {
      equipmentId,
      equipmentName,
      startDate,
      endDate,
      requiredQuantity: Number(quantity),
      contactNumber,
      deliveryAddress,
      notes,
      rentalDuration: duration,
      rentalPrice,
      rentalType,
      rentalUnits,
      bookingAmount: totalPrice,
    };

    console.log("Booking Information:", bookingData);

    alert("Booking form completed successfully!");

    setOpen(false);
  };

  // Shared styles
  const fieldClass =
    "rounded-xl border-[#E8D5A8] bg-[#FFFDF6] text-[#3B2314] placeholder:text-[#6B4426]/40 focus-visible:border-[#F5B82E] focus-visible:ring-4 focus-visible:ring-[#F5B82E]/25";

  const labelClass = "text-sm font-bold text-[#3B2314]";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        disabled={availableQuantity < 1}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#F5B82E] px-4 py-3.5 font-extrabold text-[#3B2314] shadow-md shadow-[#F5B82E]/30 transition hover:bg-[#E6A515] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#3B2314]/30 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <CalendarCheck size={18} />
        Book Now
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto rounded-3xl border-0 bg-white p-0 shadow-2xl shadow-[#3B2314]/25 ring-1 ring-[#EBDCB5] sm:max-w-137.5">
        {/* Header */}
        <DialogHeader className="bg-[#3B2314] p-6 text-left">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#F5B82E] text-[#3B2314]">
              <CalendarCheck size={24} />
            </div>

            <div>
              <DialogTitle className="text-2xl font-extrabold tracking-tight text-[#FFF3CF]">
                Book Equipment
              </DialogTitle>

              <DialogDescription className="mt-1 text-sm text-[#FDE9A8]/75">
                Complete the form to book {equipmentName}.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 p-6">
          {/* Dates */}
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="startDate" className={labelClass}>
                Rental Start Date *
              </Label>

              <Input
                id="startDate"
                type="date"
                min={today}
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  setEndDate("");
                }}
                className={fieldClass}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate" className={labelClass}>
                Rental End Date *
              </Label>

              <Input
                id="endDate"
                type="date"
                min={startDate || today}
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className={fieldClass}
                required
              />
            </div>
          </div>

          {/* Quantity */}
          <div className="space-y-2">
            <Label htmlFor="quantity" className={labelClass}>
              Required Quantity *
            </Label>

            <Input
              id="quantity"
              type="number"
              min="1"
              max={availableQuantity}
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className={fieldClass}
              required
            />

            <p className="text-xs text-[#6B4426]/70">
              Available quantity: {availableQuantity}
            </p>
          </div>

          {/* Contact Number */}
          <div className="space-y-2">
            <Label htmlFor="contactNumber" className={labelClass}>
              Contact Number *
            </Label>

            <Input
              id="contactNumber"
              type="tel"
              placeholder="01XXXXXXXXX"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
              className={fieldClass}
              required
            />
          </div>

          {/* Delivery Address */}
          <div className="space-y-2">
            <Label htmlFor="deliveryAddress" className={labelClass}>
              Delivery Address *
            </Label>

            <Textarea
              id="deliveryAddress"
              placeholder="Enter your full delivery address"
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              className={fieldClass}
              required
            />
          </div>

          {/* Additional Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes" className={labelClass}>
              Additional Notes
            </Label>

            <Textarea
              id="notes"
              placeholder="Any special instructions..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className={fieldClass}
            />
          </div>

          {/* Price Summary */}
          <div className="rounded-2xl bg-[#FFF3CF] p-5 ring-1 ring-[#F5D77A]">
            <h3 className="flex items-center gap-2 font-extrabold text-[#3B2314]">
              <Receipt size={18} className="text-[#B4651B]" />
              Price Summary
            </h3>

            <div className="mt-4 flex justify-between text-sm text-[#6B4426]">
              <span>Rental Price</span>
              <span className="font-semibold text-[#3B2314]">
                ৳{rentalPrice.toLocaleString()} / {rentalType}
              </span>
            </div>

            <div className="mt-2 flex justify-between text-sm text-[#6B4426]">
              <span>Rental Duration</span>
              <span className="font-semibold text-[#3B2314]">
                {duration} days
              </span>
            </div>

            <div className="mt-2 flex justify-between text-sm text-[#6B4426]">
              <span>Rental Units</span>
              <span className="font-semibold text-[#3B2314]">
                {rentalUnits} {unit} unit(s)
              </span>
            </div>

            <div className="mt-2 flex justify-between text-sm text-[#6B4426]">
              <span>Quantity</span>
              <span className="font-semibold text-[#3B2314]">
                {quantity || 0}
              </span>
            </div>

            <div className="mt-4 flex items-center justify-between rounded-xl bg-[#3B2314] px-4 py-3">
              <span className="text-sm font-bold text-[#FDE9A8]">
                Total Amount
              </span>

              <span className="text-xl font-extrabold text-[#F5B82E]">
                ৳{totalPrice.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            className="w-full rounded-xl bg-[#F5B82E] py-6 text-base font-extrabold text-[#3B2314] shadow-md shadow-[#F5B82E]/30 transition hover:bg-[#E6A515]"
          >
            Continue to Booking
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
