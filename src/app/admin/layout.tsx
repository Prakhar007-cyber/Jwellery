import { redirect } from "next/navigation";
import Link from "next/link";
import { requireAdmin } from "@/lib/adminGuard";
import { AdminNav } from "@/components/admin/AdminNav";

/*
  Admin layout. Protected server-side with requireAdmin(): a
  non-admin (or signed-out) user is redirected away. Admin pages
  keep ÉLANORA branding but use a more functional layout.
*/
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAdmin();
  if (!session) redirect("/login");

  return (
    <div className="min-h-screen bg-ivory">
      <header className="flex items-center justify-between border-b border-line px-6 py-4 lg:px-10">
        <Link href="/" className="font-serif text-2xl tracking-[0.25em]">ÉLANORA</Link>
        <span className="eyebrow text-gold">Atelier — Admin</span>
        <Link href="/account" className="eyebrow text-espresso-soft hover:text-espresso">Exit</Link>
      </header>
      <div className="mx-auto max-w-[1500px] px-6 py-10 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-[200px_1fr]">
          <AdminNav />
          <div>{children}</div>
        </div>
      </div>
    </div>
  );
}
