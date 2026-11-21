
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    // Not logged in
    if (!session?.user) {
      const loginUrl = new URL("/login", request.url);

      loginUrl.searchParams.set(
        "callbackURL",
        pathname + request.nextUrl.search
      );

      return NextResponse.redirect(loginUrl);
    }

    const role = String(
      session.user.role || "customer"
    ).toLowerCase();

    // Role-based dashboard access
    const dashboardRoutes = [
      { path: "/customer-dashboard", role: "customer" },
      { path: "/owner-dashboard", role: "owner" },
      { path: "/admin-dashboard", role: "admin" },
    ];

    const matchedRoute = dashboardRoutes.find(
      (route) =>
        pathname === route.path ||
        pathname.startsWith(`${route.path}/`)
    );

    if (matchedRoute && role !== matchedRoute.role) {
      const dashboardUrl =
        role === "admin"
          ? "/admin-dashboard"
          : role === "owner"
            ? "/owner-dashboard"
            : "/customer-dashboard";

      return NextResponse.redirect(
        new URL(dashboardUrl, request.url)
      );
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Proxy authentication error:", error);

    return NextResponse.redirect(
      new URL("/login", request.url)
    );
  }
}

export const config = {
  matcher: [
    "/customer-dashboard/:path*",
    "/owner-dashboard/:path*",
    "/admin-dashboard/:path*",
    "/equipment/:path*",
  ],
};
