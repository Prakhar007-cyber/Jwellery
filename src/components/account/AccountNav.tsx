"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { User, Package, MapPin, Heart, LogOut, LayoutDashboard } from "lucide-react";

// Account sidebar navigation. Admins get an extra dashboard link.
export function AccountNav({ isAdmin }: { isAdmin: boolean }) {
  const pathname = usePathname();

  const links = [
    { href: "/account", label: "Profile", icon: User },
    { href: "/account/orders", label: "Orders", icon: Package },
    { href: "/account/addresses", label: "Addresses", icon: MapPin },
    { href: "/wishlist", label: "Wishlist", icon: Heart },
  ];

  return (
    <nav className="flex flex-row gap-2 overflow-x-auto lg:flex-col lg:gap-1">
      {links.map((link) => {
        const active = pathname === link.href;
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

      {isAdmin && (
        <Link
          href="/admin"
          className="flex items-center gap-3 whitespace-nowrap px-4 py-3 text-sm text-gold hover:text-espresso"
        >
          <LayoutDashboard className="h-4 w-4" strokeWidth={1.4} />
          Admin
        </Link>
      )}

      <button
        onClick={() => signOut({ callbackUrl: "/" })}
        className="flex items-center gap-3 whitespace-nowrap px-4 py-3 text-left text-sm text-espresso-soft hover:text-espresso"
      >
        <LogOut className="h-4 w-4" strokeWidth={1.4} />
        Logout
      </button>
    </nav>
  );
}
