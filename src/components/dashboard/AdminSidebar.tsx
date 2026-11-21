
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Package,
  ClipboardList,
  UserRound,
  LogOut,
} from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

type AdminSidebarProps = {
  user: {
    name: string;
    email: string;
    image: string | null;
  };
};

const menuItems = [
  {
    title: "Overview",
    url: "/admin-dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "All Users",
    url: "/admin-dashboard/all-users",
    icon: Users,
  },
  {
    title: "All Equipment",
    url: "/admin-dashboard/all-equipment",
    icon: Package,
  },
  {
    title: "All Rentals",
    url: "/admin-dashboard/all-rentals",
    icon: ClipboardList,
  },
  {
    title: "My Profile",
    url: "/admin-dashboard/profile",
    icon: UserRound,
  },
];

export default function AdminSidebar({ user }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await authClient.signOut();
      toast.success("Logged out successfully!");
      router.push("/login");
      router.refresh();
    } catch {
      toast.error("Logout failed. Please try again.");
    }
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-[#E8D8B8]">
      <SidebarContent className="bg-[#FFF9ED]">
        <SidebarGroup>
          <SidebarGroupLabel className="mb-2 px-3 pt-4 text-xs font-semibold uppercase tracking-wider text-[#A0805B]">
            Admin Dashboard
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const isActive =
                  pathname === item.url ||
                  (item.url !== "/admin-dashboard" &&
                    pathname.startsWith(`${item.url}/`));

                return (
                  <SidebarMenuItem key={item.title}>
                    <Link href={item.url} className="block w-full">
                      <SidebarMenuButton
                        isActive={isActive}
                        tooltip={item.title}
                        className="h-11 rounded-lg text-[#705238] hover:bg-[#F2E5CE] hover:text-[#5C3D25] data-[active=true]:bg-[#8B633E] data-[active=true]:text-white data-[active=true]:hover:bg-[#76502F] data-[active=true]:hover:text-white"
                      >
                        <item.icon size={19} />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </Link>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-[#E8D8B8] bg-[#FFF9ED] p-3">
        <div className="flex items-center gap-3 rounded-lg p-2 group-data-[collapsible=icon]:justify-center">
          <Avatar className="h-9 w-9 shrink-0 border border-[#E8D8B8]">
            <AvatarImage src={user.image ?? undefined} alt={user.name} />
            <AvatarFallback className="bg-[#E8D8B8] font-semibold text-[#5C3D25]">
              {user.name?.charAt(0)?.toUpperCase() || "A"}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
            <p className="truncate text-sm font-semibold text-[#5C3D25]">
              {user.name}
            </p>
            <p className="truncate text-xs text-[#A0805B]">
              {user.email}
            </p>
          </div>
        </div>

        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleLogout}
              tooltip="Logout"
              className="h-10 rounded-lg text-red-600 hover:bg-red-50 hover:text-red-700"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
