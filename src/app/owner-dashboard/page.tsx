
import {
  Package,
  CalendarDays,
  DollarSign,
  ClipboardList,
  Plus,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

const stats = [
  {
    title: "Total Equipment",
    value: "0",
    description: "Equipment listed by you",
    icon: Package,
  },
  {
    title: "Total Rentals",
    value: "0",
    description: "Rental bookings received",
    icon: CalendarDays,
  },
  {
    title: "Total Earnings",
    value: "$0",
    description: "Your total earnings",
    icon: DollarSign,
  },
  {
    title: "Pending Requests",
    value: "0",
    description: "Requests waiting for approval",
    icon: ClipboardList,
  },
];

export default function OwnerDashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-[#5C3D25]">
          Welcome to Owner Dashboard!
        </h2>
        <p className="mt-2 text-sm text-[#A0805B]">
          Manage your equipment, rental requests and earnings.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="rounded-2xl border border-[#E8D8B8] bg-white p-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[#A0805B]">
                  {stat.title}
                </p>
                <h3 className="mt-3 text-3xl font-bold text-[#5C3D25]">
                  {stat.value}
                </h3>
              </div>

              <div className="rounded-xl bg-[#F2E5CE] p-3">
                <stat.icon className="h-6 w-6 text-[#8B633E]" />
              </div>
            </div>

            <p className="mt-3 text-xs text-[#A0805B]">
              {stat.description}
            </p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-[#E8D8B8] bg-white p-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h3 className="text-lg font-bold text-[#5C3D25]">
              Start Managing Your Equipment
            </h3>
            <p className="mt-2 text-sm text-[#A0805B]">
              Add your first equipment and start receiving rental requests.
            </p>
          </div>

          <Link
            href="/owner-dashboard/add-equipment"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#8B633E] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#76502F]"
          >
            <Plus size={18} />
            Add Equipment
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
