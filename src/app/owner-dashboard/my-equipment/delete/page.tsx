
"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Trash2, Loader2, AlertTriangle } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function DeleteEquipmentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(true);

  const handleDelete = async () => {
    if (!id) {
      toast.error("Equipment ID missing");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/equipment/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Delete failed");
      }

      toast.success("Equipment deleted successfully!");
      router.push("/owner-dashboard/my-equipment");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete equipment"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="mx-auto max-w-lg rounded-3xl bg-white p-8 text-center shadow-xl ring-1 ring-[#EBDCB5]">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FDE4DC] text-[#9A3412]">
          <AlertTriangle size={32} />
        </div>

        <h1 className="mt-5 text-2xl font-extrabold text-[#3B2314]">
          Delete Equipment?
        </h1>

        <p className="mt-3 text-sm leading-6 text-[#6B4426]">
          Click the button below to confirm equipment deletion.
        </p>

        <button
          type="button"
          onClick={() => setOpen(true)}
          className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-[#9A3412] px-5 py-3 font-bold text-white hover:bg-[#7C2D12]"
        >
          <Trash2 size={18} />
          Delete Equipment
        </button>
      </div>

      <AlertDialog
        open={open}
        onOpenChange={(value) => {
          if (!loading) {
            setOpen(value);

            if (!value) {
              router.back();
            }
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[#3B2314]">
              Are you absolutely sure?
            </AlertDialogTitle>

            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              equipment from Rentora.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
              disabled={loading || !id}
              onClick={(e) => {
                e.preventDefault();
                handleDelete();
              }}
              className="bg-[#9A3412] text-white hover:bg-[#7C2D12]"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Continue"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
