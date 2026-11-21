
import AdminSidebar from "@/components/dashboard/AdminSidebar";

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import { Separator } from "@/components/ui/separator";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider defaultOpen={true}>
      <AdminSidebar
        user={{
          name: "Admin",
          email: "",
          image: null,
        }}
      />

      <SidebarInset className="min-h-screen bg-[#FFF9ED]">
        <header className="flex h-16 items-center gap-3 border-b border-[#E8D8B8] bg-white px-4">
          <SidebarTrigger className="text-[#5C3D25]" />

          <Separator orientation="vertical" className="h-6" />

          <div>
            <h1 className="text-lg font-bold text-[#5C3D25]">
              Admin Dashboard
            </h1>

            <p className="text-xs text-[#A0805B]">
              Manage users, equipment and rental activities
            </p>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
