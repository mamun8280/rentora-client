
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

export type Equipment = {
  _id: string;
  equipmentName: string;
  category: string;
  ownerName: string;
  ownerEmail: string;
  rentalPrice: number | string;
  rentalType: "Daily" | "Weekly" | "Monthly";
  status: "Pending" | "Approved" | "Rejected";
};

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/admin/equipment`;

// GET JWT TOKEN
const getAuthHeaders = async () => {
  const { data, error } = await authClient.token();

  if (error || !data?.token) {
    throw new Error("Please login again. JWT token not found.");
  }

  return {
    Authorization: `Bearer ${data.token}`,
  };
};

// GET ALL EQUIPMENT
export const fetchEquipment = async (): Promise<Equipment[]> => {
  try {
    const headers = await getAuthHeaders();

    const res = await fetch(API_URL, {
      headers,
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch equipment: ${res.status}`);
    }

    const data = await res.json();

    return data.equipment || [];
  } catch (error) {
    console.error("Fetch equipment error:", error);
    toast.error("Failed to load equipment");
    return [];
  }
};

// UPDATE / APPROVE / REJECT EQUIPMENT
export const updateEquipment = async (
  id: string,
  updateData: Partial<Equipment>
): Promise<boolean> => {
  try {
    const headers = await getAuthHeaders();

    const res = await fetch(`${API_URL}/${id}`, {
      method: "PATCH",
      headers: {
        ...headers,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateData),
    });

    if (!res.ok) {
      throw new Error(`Equipment update failed: ${res.status}`);
    }

    const data = await res.json();

    return data.success === true;
  } catch (error) {
    console.error("Update equipment error:", error);
    toast.error("Equipment update failed");
    return false;
  }
};

// DELETE EQUIPMENT
export const deleteEquipment = async (
  id: string
): Promise<boolean> => {
  try {
    const headers = await getAuthHeaders();

    const res = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers,
    });

    if (!res.ok) {
      throw new Error(`Delete failed: ${res.status}`);
    }

    const data = await res.json();

    return data.success === true;
  } catch (error) {
    console.error("Delete equipment error:", error);
    toast.error("Delete failed");
    return false;
  }
};
