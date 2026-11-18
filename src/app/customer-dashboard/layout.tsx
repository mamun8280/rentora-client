
import CustomerSidebar from "@/components/dashboard/CustomerSidebar";

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import { Separator } from "@/components/ui/separator";

export default function CustomerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider defaultOpen={true}>
      <CustomerSidebar
        user={{
          name: "Customer",
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
              Customer Dashboard
            </h1>
            <p className="text-xs text-[#A0805B]">
              Manage your rentals and account
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
