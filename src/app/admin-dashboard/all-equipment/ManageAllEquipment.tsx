
import { toast } from "sonner";

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

const API_URL = "http://localhost:5000/api/admin/equipment";

// GET ALL EQUIPMENT
export const fetchEquipment = async (): Promise<Equipment[]> => {
  try {
    const res = await fetch(API_URL);

    if (!res.ok) {
      throw new Error("Failed to fetch equipment");
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
    const res = await fetch(`${API_URL}/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateData),
    });

    if (!res.ok) {
      throw new Error("Equipment update failed");
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
    const res = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      throw new Error("Delete failed");
    }

    const data = await res.json();

    return data.success === true;
  } catch (error) {
    console.error("Delete equipment error:", error);
    toast.error("Delete failed");
    return false;
  }
};
