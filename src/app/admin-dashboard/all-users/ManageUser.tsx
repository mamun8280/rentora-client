"use client";

import { useState } from "react";
import { toast } from "sonner";
import Image from "next/image";
import { MoreHorizontal, Save, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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

type User = {
  _id: string;
  name: string;
  email: string;
  role: "customer" | "owner" | "admin";
  createdAt: string;
  image?: string | null;
};

type ManageUserProps = {
  user: User;
  onRoleUpdated: (id: string, role: User["role"]) => void;
  onDeleted: (id: string) => void;
};

export default function ManageUser({
  user,
  onRoleUpdated,
  onDeleted,
}: ManageUserProps) {
  const [open, setOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [role, setRole] = useState<User["role"]>(user.role);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleUpdateRole = async () => {
    if (role === user.role) {
      toast.info("Please select a different role");
      return;
    }

    try {
      setUpdating(true);

      const res = await fetch(
        `http://localhost:5000/api/admin/users/${user._id}/role`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ role }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to update role");
      }

      onRoleUpdated(user._id, role);
      toast.success("User role updated successfully");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update role",
      );
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteUser = async () => {
    try {
      setDeleting(true);

      const res = await fetch(
        `http://localhost:5000/api/admin/users/${user._id}`,
        {
          method: "DELETE",
        },
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to delete user");
      }

      onDeleted(user._id);
      setDeleteOpen(false);
      setOpen(false);
      toast.success("User deleted successfully");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete user",
      );
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <Button
        size="icon"
        variant="outline"
        className="border-[#E8D8B8] text-[#705238]"
        title="Manage User"
        onClick={() => setOpen(true)}
      >
        <MoreHorizontal className="h-4 w-4" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-[90vw]! max-w-5xl! border-[#E8D8B8] bg-white sm:max-w-5xl!">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-[#5C3D25]">
              User Details
            </DialogTitle>

            <DialogDescription className="text-[#A0805B]">
              View and manage user information.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5">
            <div className="flex items-center gap-4">
              {user.image && !imageError ? (
                <Image
                  src={user.image}
                  alt={user.name}
                  width={56}
                  height={56}
                  unoptimized
                  onError={() => setImageError(true)}
                  className="h-14 w-14 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#F5B82E] text-xl font-bold text-[#3B2314]">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
              )}

              <div>
                <h3 className="font-semibold text-[#5C3D25]">{user.name}</h3>

                <p className="text-sm text-[#A0805B]">{user.email}</p>

                <span className="mt-1 inline-block rounded-full bg-[#E8F2E8] px-3 py-1 text-xs font-semibold capitalize text-[#34765A]">
                  {user.role}
                </span>
              </div>
            </div>

            <div className="space-y-3 rounded-lg border border-[#E8D8B8] p-4">
              <h3 className="font-semibold text-[#5C3D25]">User Information</h3>

              <div className="flex justify-between gap-3 text-sm">
                <span className="text-[#A0805B]">Name</span>
                <span className="text-right font-medium text-[#5C3D25]">
                  {user.name}
                </span>
              </div>

              <div className="flex justify-between gap-3 text-sm">
                <span className="text-[#A0805B]">Email</span>
                <span className="break-all text-right font-medium text-[#5C3D25]">
                  {user.email}
                </span>
              </div>

              <div className="flex justify-between gap-3 text-sm">
                <span className="text-[#A0805B]">Registration Date</span>
                <span className="text-right font-medium text-[#5C3D25]">
                  {user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString()
                    : "N/A"}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-[#5C3D25]">Change Role</h3>

              <div className="flex gap-2">
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as User["role"])}
                  className="h-10 flex-1 rounded-md border border-[#D8BD91] bg-white px-3 text-sm text-[#5C3D25] outline-none focus:ring-2 focus:ring-[#D8BD91]"
                >
                  <option value="customer">Customer</option>
                  <option value="owner">Owner</option>
                  <option value="admin">Admin</option>
                </select>

                <Button
                  size="icon"
                  onClick={handleUpdateRole}
                  disabled={updating || role === user.role}
                  className="bg-[#8B633E] text-white hover:bg-[#705238]"
                  title="Update Role"
                >
                  <Save className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex justify-end border-t border-[#E8D8B8] pt-4">
              <Button
                variant="destructive"
                onClick={() => setDeleteOpen(true)}
                className="gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Delete User
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User?</AlertDialogTitle>

            <AlertDialogDescription>
              Are you sure you want to delete {user.name}? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>

            <AlertDialogAction
              onClick={handleDeleteUser}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
