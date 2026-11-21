import CustomerSidebar from "@/components/dashboard/CustomerSidebar";

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import { Separator } from "@/components/ui/separator";
import { LayoutDashboard } from "lucide-react";

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

      <SidebarInset className="min-h-screen bg-[#FFF9EA] bg-[radial-gradient(ellipse_at_top_right,#FDE9A8_0%,transparent_40%)]">
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-[#EBDCB5] bg-white/80 px-4 backdrop-blur-md">
          <SidebarTrigger className="rounded-lg text-[#3B2314] hover:bg-[#FFF3CF] hover:text-[#3B2314]" />

          <Separator
            orientation="vertical"
            className="h-6 bg-[#EBDCB5]"
          />

          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#3B2314] text-[#F5B82E] shadow-md shadow-[#3B2314]/20">
              <LayoutDashboard size={18} />
            </div>

            <div>
              <h1 className="text-lg font-extrabold leading-tight tracking-tight text-[#3B2314]">
                Customer Dashboard
              </h1>
              <p className="hidden text-xs text-[#6B4426]/75 sm:block">
                Manage your rentals and account
              </p>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}