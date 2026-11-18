
import { CalendarDays, PackageSearch } from "lucide-react";

export default function MyRentalsPage() {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-medium text-[#A0805B]">
          CUSTOMER DASHBOARD
        </p>

        <h1 className="mt-2 text-3xl font-bold text-[#5C3D25]">
          My Rentals
        </h1>

        <p className="mt-2 text-sm text-[#A0805B]">
          Track and manage all your equipment rentals.
        </p>
      </div>

      <div className="rounded-2xl border border-[#E8D8B8] bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <PackageSearch className="text-[#8B633E]" size={22} />
          <h2 className="text-xl font-bold text-[#5C3D25]">
            Rental History
          </h2>
        </div>

        <div className="py-16 text-center">
          <CalendarDays
            size={42}
            className="mx-auto text-[#C5A984]"
          />

          <p className="mt-4 font-semibold text-[#5C3D25]">
            No rentals found
          </p>

          <p className="mt-1 text-sm text-[#A0805B]">
            Your booked equipment will appear here.
          </p>
        </div>
      </div>
    </div>
  );
}
