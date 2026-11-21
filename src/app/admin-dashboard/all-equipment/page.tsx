"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Check, X, Trash2, Pencil, Loader2, Package } from "lucide-react";

import {
  fetchEquipment,
  updateEquipment,
  deleteEquipment,
} from "./ManageAllEquipment";

import type { Equipment } from "./ManageAllEquipment";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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

export default function AllEquipmentPage() {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);

  const [editItem, setEditItem] = useState<Equipment | null>(null);
  const [deleteItem, setDeleteItem] = useState<Equipment | null>(null);

  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [statusLoading, setStatusLoading] = useState<string | null>(null);

  // LOAD EQUIPMENT
  const loadEquipment = async () => {
    const data = await fetchEquipment();
    setEquipment(data);
    setLoading(false);
  };

  useEffect(() => {
    const getEquipment = async () => {
      const data = await fetchEquipment();
      setEquipment(data);
      setLoading(false);
    };

    getEquipment();
  }, []);

  // APPROVE / REJECT
  const handleStatus = async (
    id: string,
    status: "Approved" | "Rejected"
  ) => {
    setStatusLoading(id);

    const success = await updateEquipment(id, { status });

    if (success) {
      toast.success(`Equipment ${status}`);
      await loadEquipment();
    } else {
      toast.error(`Failed to ${status.toLowerCase()} equipment`);
    }

    setStatusLoading(null);
  };

  // UPDATE EQUIPMENT
  const handleUpdate = async () => {
    if (!editItem) return;

    const price = Number(editItem.rentalPrice);

    if (
      !editItem.equipmentName.trim() ||
      !editItem.category.trim() ||
      editItem.rentalPrice === "" ||
      !Number.isFinite(price) ||
      price <= 0 ||
      !["Daily", "Weekly", "Monthly"].includes(editItem.rentalType)
    ) {
      toast.error("Please enter valid information");
      return;
    }

    setUpdating(true);

    const success = await updateEquipment(editItem._id, {
      equipmentName: editItem.equipmentName.trim(),
      category: editItem.category.trim(),
      rentalPrice: price,
      rentalType: editItem.rentalType,
    });

    if (success) {
      toast.success("Equipment updated successfully");
      setEditItem(null);
      await loadEquipment();
    } else {
      toast.error("Equipment update failed");
    }

    setUpdating(false);
  };

  // DELETE EQUIPMENT
  const handleDelete = async () => {
    if (!deleteItem) return;

    setDeleting(true);

    const success = await deleteEquipment(deleteItem._id);

    if (success) {
      toast.success("Equipment deleted successfully");
      setDeleteItem(null);
      await loadEquipment();
    } else {
      toast.error("Equipment deletion failed");
    }

    setDeleting(false);
  };

  const inputClass =
    "w-full rounded-xl border border-[#E8D5A8] bg-[#FFFDF6] p-3 text-sm text-[#3B2314] placeholder:text-[#6B4426]/40 outline-none transition focus:border-[#F5B82E] focus:bg-white focus:ring-4 focus:ring-[#F5B82E]/25";

  const labelClass = "mb-2 block text-sm font-bold text-[#3B2314]";

  const headClass =
    "px-5 py-4 text-xs font-bold uppercase tracking-wider text-[#6B4426]";

  const statusStyles = (status: string) => {
    if (status === "Approved")
      return { chip: "bg-[#ECF6D8] text-[#3F6212]", dot: "bg-[#65A30D]" };
    if (status === "Rejected")
      return { chip: "bg-[#FDE4DC] text-[#9A3412]", dot: "bg-[#DC4A1F]" };
    return { chip: "bg-[#FDE9A8] text-[#7C4A0E]", dot: "bg-[#E6A515]" };
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <p className="inline-flex items-center gap-2 rounded-full bg-[#F5B82E]/25 px-3 py-1 text-xs font-bold text-[#7C4A0E]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#B4651B]" />
          Admin dashboard
        </p>

        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-[#3B2314] sm:text-4xl">
          All Equipment
        </h1>
        <p className="mt-2 text-sm text-[#6B4426]/80">
          Manage all owner equipment
        </p>
      </div>

      {/* EQUIPMENT TABLE */}
      <div className="overflow-hidden rounded-3xl bg-white shadow-xl shadow-[#3B2314]/5 ring-1 ring-[#EBDCB5]">
        <div className="flex items-center gap-3 border-b border-[#F0E3BF] px-5 py-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#3B2314] text-[#F5B82E]">
            <Package size={20} />
          </div>
          <h2 className="font-extrabold text-[#3B2314]">
            Equipment List ({equipment.length})
          </h2>
        </div>

        {loading ? (
          <div className="flex flex-col items-center py-20">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#3B2314]">
              <Loader2 size={28} className="animate-spin text-[#F5B82E]" />
            </div>
          </div>
        ) : equipment.length === 0 ? (
          <div className="flex flex-col items-center px-4 py-20 text-center">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-[#FDE9A8] text-[#3B2314]">
              <Package size={34} />
            </div>
            <p className="text-lg font-extrabold text-[#3B2314]">
              No equipment found.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-237.5 text-sm">
              <thead className="bg-[#FFF3CF]">
                <tr>
                  <th className={`${headClass} text-left`}>Equipment</th>
                  <th className={`${headClass} text-left`}>Owner</th>
                  <th className={`${headClass} text-left`}>Rental Price</th>
                  <th className={`${headClass} text-left`}>Rental Type</th>
                  <th className={`${headClass} text-left`}>Status</th>
                  <th className={`${headClass} text-center`}>Actions</th>
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
                      {/* EQUIPMENT */}
                      <td className="px-5 py-4">
                        <p className="font-bold text-[#3B2314]">
                          {item.equipmentName}
                        </p>
                        <span className="mt-1 inline-block rounded-full bg-[#FFF3CF] px-2.5 py-0.5 text-xs font-semibold text-[#7C4A0E]">
                          {item.category}
                        </span>
                      </td>

                      {/* OWNER */}
                      <td className="px-5 py-4">
                        <p className="font-semibold text-[#3B2314]">
                          {item.ownerName}
                        </p>
                        <p className="text-xs text-[#6B4426]/70">
                          {item.ownerEmail}
                        </p>
                      </td>

                      {/* RENTAL PRICE */}
                      <td className="px-5 py-4 font-extrabold text-[#B4651B]">
                        ৳{Number(item.rentalPrice ?? 0).toLocaleString("en-BD")}
                      </td>

                      {/* RENTAL TYPE */}
                      <td className="px-5 py-4">
                        <span className="rounded-full bg-[#FFF3CF] px-3 py-1 text-xs font-bold text-[#7C4A0E]">
                          {item.rentalType || "Daily"}
                        </span>
                      </td>

                      {/* STATUS */}
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold ${s.chip}`}
                        >
                          <span className={`h-2 w-2 rounded-full ${s.dot}`} />
                          {item.status}
                        </span>
                      </td>

                      {/* ACTIONS */}
                      <td className="px-5 py-4">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() =>
                              handleStatus(item._id, "Approved")
                            }
                            disabled={statusLoading === item._id}
                            className="rounded-lg bg-[#ECF6D8] p-2 text-[#3F6212] transition hover:bg-[#DDEEBF] disabled:opacity-50"
                            title="Approve"
                          >
                            <Check size={16} />
                          </button>

                          <button
                            onClick={() =>
                              handleStatus(item._id, "Rejected")
                            }
                            disabled={statusLoading === item._id}
                            className="rounded-lg bg-[#FDE4DC] p-2 text-[#9A3412] transition hover:bg-[#FBD0C2] disabled:opacity-50"
                            title="Reject"
                          >
                            <X size={16} />
                          </button>

                          <button
                            onClick={() => setEditItem({ ...item })}
                            className="rounded-lg bg-[#F5B82E] p-2 text-[#3B2314] transition hover:bg-[#E6A515]"
                            title="Edit"
                          >
                            <Pencil size={16} />
                          </button>

                          <button
                            onClick={() => setDeleteItem(item)}
                            className="rounded-lg bg-[#3B2314] p-2 text-[#F5B82E] transition hover:bg-[#2A180D]"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
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

      {/* UPDATE EQUIPMENT DIALOG */}
      <Dialog
        open={!!editItem}
        onOpenChange={(open) => {
          if (!open && !updating) setEditItem(null);
        }}
      >
        <DialogContent className="overflow-hidden rounded-3xl border-0 bg-white p-0 shadow-2xl shadow-[#3B2314]/25 ring-1 ring-[#EBDCB5] sm:max-w-125">
          <DialogHeader className="bg-[#3B2314] p-6 text-left">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#F5B82E] text-[#3B2314]">
                <Pencil size={22} />
              </div>

              <div>
                <DialogTitle className="text-xl font-extrabold tracking-tight text-[#FFF3CF]">
                  Update Equipment
                </DialogTitle>

                <DialogDescription className="mt-1 text-[#FDE9A8]/75">
                  Update equipment information below.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {editItem && (
            <div className="space-y-4 px-6 py-2">
              {/* EQUIPMENT NAME */}
              <div>
                <label className={labelClass}>Equipment Name</label>

                <input
                  type="text"
                  value={editItem.equipmentName}
                  onChange={(e) =>
                    setEditItem({
                      ...editItem,
                      equipmentName: e.target.value,
                    })
                  }
                  className={inputClass}
                  placeholder="Enter equipment name"
                />
              </div>

              {/* CATEGORY */}
              <div>
                <label className={labelClass}>Category</label>

                <input
                  type="text"
                  value={editItem.category}
                  onChange={(e) =>
                    setEditItem({
                      ...editItem,
                      category: e.target.value,
                    })
                  }
                  className={inputClass}
                  placeholder="Enter category"
                />
              </div>

              {/* RENTAL PRICE */}
              <div>
                <label className={labelClass}>Rental Price (৳) *</label>

                <input
                  type="number"
                  min="1"
                  value={editItem.rentalPrice ?? ""}
                  onChange={(e) =>
                    setEditItem({
                      ...editItem,
                      rentalPrice: e.target.value,
                    })
                  }
                  className={inputClass}
                  placeholder="Enter rental price"
                />
              </div>

              {/* RENTAL TYPE */}
              <div>
                <label className={labelClass}>Rental Type *</label>

                <select
                  value={editItem.rentalType || "Daily"}
                  onChange={(e) =>
                    setEditItem({
                      ...editItem,
                      rentalType: e.target.value as
                        | "Daily"
                        | "Weekly"
                        | "Monthly",
                    })
                  }
                  className={inputClass}
                >
                  <option value="Daily">Daily</option>
                  <option value="Weekly">Weekly</option>
                  <option value="Monthly">Monthly</option>
                </select>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2 bg-[#FFFCF2] p-6">
            <button
              type="button"
              onClick={() => setEditItem(null)}
              disabled={updating}
              className="rounded-xl border border-[#E8D5A8] bg-white px-5 py-2.5 text-sm font-bold text-[#3B2314] transition hover:bg-[#FFF3CF] disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleUpdate}
              disabled={updating}
              className="flex items-center justify-center gap-2 rounded-xl bg-[#F5B82E] px-5 py-2.5 text-sm font-extrabold text-[#3B2314] shadow-md shadow-[#F5B82E]/30 transition hover:bg-[#E6A515] disabled:opacity-50"
            >
              {updating && (
                <Loader2 size={16} className="animate-spin" />
              )}
              {updating ? "Updating..." : "Update Equipment"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DELETE CONFIRMATION ALERT DIALOG */}
      <AlertDialog
        open={!!deleteItem}
        onOpenChange={(open) => {
          if (!open && !deleting) setDeleteItem(null);
        }}
      >
        <AlertDialogContent className="rounded-3xl border-0 bg-white shadow-2xl shadow-[#3B2314]/25 ring-1 ring-[#EBDCB5]">
          <AlertDialogHeader>
            <div className="mb-2 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FDE4DC] text-[#9A3412]">
              <Trash2 size={26} />
            </div>

            <AlertDialogTitle className="text-lg font-extrabold text-[#3B2314]">
              Delete Equipment?
            </AlertDialogTitle>

            <AlertDialogDescription className="text-[#6B4426]/85">
              Are you sure you want to delete{" "}
              <span className="font-bold text-[#3B2314]">
                {deleteItem?.equipmentName}
              </span>
              ? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={deleting}
              className="rounded-xl border-[#E8D5A8] font-bold text-[#3B2314] hover:bg-[#FFF3CF]"
            >
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleDelete();
              }}
              disabled={deleting}
              className="rounded-xl bg-[#B93815] font-bold text-white hover:bg-[#9A2F10]"
            >
              {deleting ? (
                <>
                  <Loader2 size={16} className="mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}