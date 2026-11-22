
"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ShieldCheck, Loader2, Users } from "lucide-react";
import { authClient } from "@/lib/auth-client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import ManageUser from "./ManageUser";

type User = {
  _id: string;
  name: string;
  email: string;
  role: "customer" | "owner" | "admin";
  createdAt: string;
  image?: string | null;
};

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const getAuthHeaders = async () => {
  const { data, error } = await authClient.token();

  if (error || !data?.token) {
    throw new Error("Please login again. JWT token not found.");
  }

  return {
    Authorization: `Bearer ${data.token}`,
  };
};

export default function AllUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoles, setSelectedRoles] = useState<
    Record<string, User["role"]>
  >({});
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // FETCH USERS
  useEffect(() => {
    let ignore = false;

    const fetchUsers = async () => {
      try {
        const headers = await getAuthHeaders();

        const res = await fetch(`${API_URL}/api/admin/users`, {
          headers,
          cache: "no-store",
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to load users");
        }

        if (!ignore) {
          setUsers(data.users || []);
        }
      } catch (error) {
        console.error("Fetch users error:", error);

        if (!ignore) {
          toast.error(
            error instanceof Error ? error.message : "Failed to load users"
          );
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    fetchUsers();

    return () => {
      ignore = true;
    };
  }, []);

  // CHANGE ROLE
  const handleRoleChange = async (
    id: string,
    currentRole: User["role"]
  ) => {
    const newRole = selectedRoles[id] || currentRole;

    if (newRole === currentRole) {
      toast.info("Please select a different role");
      return;
    }

    try {
      setUpdatingId(id);

      const headers = await getAuthHeaders();

      const res = await fetch(
        `${API_URL}/api/admin/users/${id}/role`,
        {
          method: "PATCH",
          headers: {
            ...headers,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ role: newRole }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to update role");
      }

      setUsers((prev) =>
        prev.map((user) =>
          user._id === id ? { ...user, role: newRole } : user
        )
      );

      toast.success("User role updated successfully");
    } catch (error) {
      console.error(error);
      toast.error(
        error instanceof Error ? error.message : "Failed to update role"
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const getRoleStyle = (role: User["role"]) => {
    if (role === "admin") return "bg-[#3B2314] text-[#F5B82E]";
    if (role === "owner") return "bg-[#FDE9A8] text-[#7C4A0E]";
    return "bg-[#ECF6D8] text-[#3F6212]";
  };

  const headClass =
    "px-5 py-4 text-xs font-bold uppercase tracking-wider text-[#6B4426]";

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <p className="inline-flex items-center gap-2 rounded-full bg-[#F5B82E]/25 px-3 py-1 text-xs font-bold text-[#7C4A0E]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#B4651B]" />
          Admin dashboard
        </p>

        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-[#3B2314] sm:text-4xl">
          All Users
        </h1>

        <p className="mt-2 text-sm text-[#6B4426]/80">
          Manage all registered users and their platform roles.
        </p>
      </div>

      {/* USER LIST */}
      <div className="overflow-hidden rounded-3xl bg-white shadow-xl shadow-[#3B2314]/5 ring-1 ring-[#EBDCB5]">
        <div className="flex items-center justify-between gap-3 border-b border-[#F0E3BF] px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#3B2314] text-[#F5B82E]">
              <Users size={20} />
            </div>

            <h2 className="font-extrabold text-[#3B2314]">
              User List ({users.length})
            </h2>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b-0 bg-[#FFF3CF] hover:bg-[#FFF3CF]">
                <TableHead className={headClass}>Name</TableHead>
                <TableHead className={headClass}>Email</TableHead>
                <TableHead className={headClass}>Role</TableHead>
                <TableHead className={headClass}>
                  Registration Date
                </TableHead>
                <TableHead className={headClass}>Action</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading ? (
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={5} className="py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#3B2314]">
                        <Loader2
                          size={24}
                          className="animate-spin text-[#F5B82E]"
                        />
                      </div>

                      <span className="text-sm font-medium text-[#6B4426]">
                        Loading users...
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : users.length === 0 ? (
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={5} className="py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FDE9A8] text-[#3B2314]">
                        <Users size={26} />
                      </div>

                      <span className="text-sm font-semibold text-[#6B4426]">
                        No users found.
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow
                    key={user._id}
                    className="border-[#F5EBCF] transition hover:bg-[#FFFBEB]"
                  >
                    <TableCell className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F5B82E] text-sm font-extrabold uppercase text-[#3B2314] ring-4 ring-[#FFF3CF]">
                          {user.name?.charAt(0) || "?"}
                        </div>

                        <span className="font-bold text-[#3B2314]">
                          {user.name}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell className="px-5 py-4 text-[#6B4426]">
                      {user.email}
                    </TableCell>

                    <TableCell className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1.5 text-xs font-bold capitalize ${getRoleStyle(user.role)}`}
                      >
                        {user.role}
                      </span>
                    </TableCell>

                    <TableCell className="whitespace-nowrap px-5 py-4 text-[#6B4426]">
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString()
                        : "N/A"}
                    </TableCell>

                    <TableCell className="px-5 py-4">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                        <select
                          value={selectedRoles[user._id] || user.role}
                          onChange={(e) =>
                            setSelectedRoles((prev) => ({
                              ...prev,
                              [user._id]: e.target.value as User["role"],
                            }))
                          }
                          className="rounded-xl border border-[#E8D5A8] bg-[#FFFDF6] px-3 py-2 text-sm font-medium text-[#3B2314] outline-none transition focus:border-[#F5B82E] focus:ring-4 focus:ring-[#F5B82E]/25"
                        >
                          <option value="customer">Customer</option>
                          <option value="owner">Owner</option>
                          <option value="admin">Admin</option>
                        </select>

                        <Button
                          size="sm"
                          variant="outline"
                          className="rounded-xl border-[#F5B82E] bg-[#F5B82E] font-bold text-[#3B2314] shadow-sm transition hover:bg-[#E6A515] hover:text-[#3B2314] disabled:opacity-60"
                          onClick={() =>
                            handleRoleChange(user._id, user.role)
                          }
                          disabled={updatingId === user._id}
                        >
                          <ShieldCheck className="mr-1 h-4 w-4" />

                          {updatingId === user._id
                            ? "Updating..."
                            : "Change Role"}
                        </Button>

                        <ManageUser
                          user={user}
                          onRoleUpdated={(id, role) => {
                            setUsers((prev) =>
                              prev.map((u) =>
                                u._id === id ? { ...u, role } : u
                              )
                            );

                            setSelectedRoles((prev) => ({
                              ...prev,
                              [id]: role,
                            }));
                          }}
                          onDeleted={(id) => {
                            setUsers((prev) =>
                              prev.filter((u) => u._id !== id)
                            );

                            setSelectedRoles((prev) => {
                              const updated = { ...prev };
                              delete updated[id];
                              return updated;
                            });
                          }}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
