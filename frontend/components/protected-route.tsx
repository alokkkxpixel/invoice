"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/UserContext";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const publicRoutes = ["/login", "/register", "/"];

  useEffect(() => {
    if (!isLoading && !user) {
      if (!publicRoutes.includes(pathname)) {
        router.push("/login");
      }
    } else if (!isLoading && user) {
      // If user is logged in and visits login/register/root, redirect to app
      if (publicRoutes.includes(pathname)) {
        router.push("/invoices");
      }
    }
  }, [user, isLoading, router, pathname]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <span className="text-sm text-slate-500">Loading your session...</span>
      </div>
    );
  }

  // If no user and we are on a protected route, we don't render children to avoid flash of content
  if (!user && !publicRoutes.includes(pathname)) {
    return null;
  }

  return <>{children}</>;
}
