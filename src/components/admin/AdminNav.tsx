"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, ShoppingBag } from "lucide-react";

// Admin sidebar navigation.
export function AdminNav() {
  const pathname = usePathname();
  const links = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/products", label: "Products", icon: Package },
    { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  ];

  return (
    <nav className="flex flex-row gap-2 overflow-x-auto lg:flex-col lg:gap-1">
      {links.map((link) => {
        const active = link.href === "/admin" ? pathname === link.href : pathname.startsWith(link.href);
        const Icon = link.icon;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`flex items-center gap-3 whitespace-nowrap px-4 py-3 text-sm transition-colors ${
              active ? "bg-pearl text-espresso" : "text-espresso-soft hover:text-espresso"
            }`}
          >
            <Icon className="h-4 w-4" strokeWidth={1.4} />
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
