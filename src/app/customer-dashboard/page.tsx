
import {
  LayoutDashboard,
  CalendarDays,
  Heart,
  Clock,
} from "lucide-react";

export default function CustomerDashboardPage() {
  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <p className="text-sm font-medium text-[#A0805B]">
          CUSTOMER DASHBOARD
        </p>

        <h1 className="mt-2 text-3xl font-bold text-[#5C3D25]">
          Welcome Back!
        </h1>

        <p className="mt-2 text-sm text-[#A0805B]">
          Manage your rentals, favorites and account from here.
        </p>
      </div>

      {/* Dashboard Stats */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-2xl border border-[#E8D8B8] bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#A0805B]">
                Total Rentals
              </p>
              <h2 className="mt-2 text-3xl font-bold text-[#5C3D25]">
                0
              </h2>
            </div>

            <div className="rounded-xl bg-[#FFF1D0] p-3">
              <CalendarDays className="text-[#8B633E]" size={24} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-[#E8D8B8] bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#A0805B]">
                Favorites
              </p>
              <h2 className="mt-2 text-3xl font-bold text-[#5C3D25]">
                0
              </h2>
            </div>

            <div className="rounded-xl bg-[#FFF1D0] p-3">
              <Heart className="text-[#8B633E]" size={24} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-[#E8D8B8] bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#A0805B]">
                Active Rentals
              </p>
              <h2 className="mt-2 text-3xl font-bold text-[#5C3D25]">
                0
              </h2>
            </div>

            <div className="rounded-xl bg-[#FFF1D0] p-3">
              <Clock className="text-[#8B633E]" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="rounded-2xl border border-[#E8D8B8] bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <LayoutDashboard className="text-[#8B633E]" size={22} />

          <h2 className="text-xl font-bold text-[#5C3D25]">
            Recent Activity
          </h2>
        </div>

        <div className="py-12 text-center">
          <CalendarDays
            size={40}
            className="mx-auto text-[#C5A984]"
          />

          <p className="mt-4 font-semibold text-[#5C3D25]">
            No recent activity
          </p>

          <p className="mt-1 text-sm text-[#A0805B]">
            Your rental activities will appear here.
          </p>
        </div>
      </div>
    </div>
  );
}
