
"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ShieldCheck } from "lucide-react";

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

export default function AllUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoles, setSelectedRoles] = useState<
    Record<string, User["role"]>
  >({});
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/admin/users");

        if (!res.ok) {
          throw new Error("Failed to load users");
        }

        const data = await res.json();
        setUsers(data.users || []);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

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

      const res = await fetch(
        `http://localhost:5000/api/admin/users/${id}/role`,
        {
          method: "PATCH",
          headers: {
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
    if (role === "admin") return "bg-purple-100 text-purple-700";
    if (role === "owner") return "bg-[#F8E9C9] text-[#8B633E]";
    return "bg-[#E8F2E8] text-[#34765A]";
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#5C3D25] sm:text-3xl">
          All Users
        </h1>
        <p className="mt-2 text-sm text-[#A0805B]">
          Manage all registered users and their platform roles.
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border border-[#E8D8B8] bg-white">
        <div className="border-b border-[#E8D8B8] p-5">
          <h2 className="font-semibold text-[#5C3D25]">
            User List ({users.length})
          </h2>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#FFF9ED] hover:bg-[#FFF9ED]">
                <TableHead className="font-semibold text-[#5C3D25]">
                  Name
                </TableHead>
                <TableHead className="font-semibold text-[#5C3D25]">
                  Email
                </TableHead>
                <TableHead className="font-semibold text-[#5C3D25]">
                  Role
                </TableHead>
                <TableHead className="font-semibold text-[#5C3D25]">
                  Registration Date
                </TableHead>
                <TableHead className="font-semibold text-[#5C3D25]">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-10 text-center">
                    Loading users...
                  </TableCell>
                </TableRow>
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="py-10 text-center text-[#A0805B]"
                  >
                    No users found.
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell className="font-medium text-[#5C3D25]">
                      {user.name}
                    </TableCell>

                    <TableCell className="text-[#705238]">
                      {user.email}
                    </TableCell>

                    <TableCell>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${getRoleStyle(
                          user.role
                        )}`}
                      >
                        {user.role}
                      </span>
                    </TableCell>

                    <TableCell className="whitespace-nowrap text-[#705238]">
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString()
                        : "N/A"}
                    </TableCell>

                    <TableCell>
                      <div className="flex flex-col gap-2 sm:flex-row">
                        <select
                          value={selectedRoles[user._id] || user.role}
                          onChange={(e) =>
                            setSelectedRoles((prev) => ({
                              ...prev,
                              [user._id]: e.target.value as User["role"],
                            }))
                          }
                          className="rounded-md border border-[#D8BD91] bg-white px-2 py-1.5 text-sm text-[#5C3D25] outline-none"
                        >
                          <option value="customer">Customer</option>
                          <option value="owner">Owner</option>
                          <option value="admin">Admin</option>
                        </select>

                        <Button
                          size="sm"
                          variant="outline"
                          className="border-[#D8BD91] text-[#8B633E] hover:bg-[#FFF9ED]"
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
