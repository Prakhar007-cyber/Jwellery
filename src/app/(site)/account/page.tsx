import { auth } from "@/lib/auth";
import { getUserOrders } from "@/lib/orders";
import Link from "next/link";
import { money } from "@/lib/constants";

// Profile overview — greeting, details and a recent-orders snapshot.
export default async function AccountPage() {
  const session = await auth();
  const orders = session?.user?.id ? await getUserOrders(session.user.id) : [];

  return (
    <div className="space-y-12">
      <section>
        <h2 className="font-serif text-2xl">Profile</h2>
        <div className="mt-5 grid gap-6 sm:grid-cols-2">
          <Detail label="Name" value={session?.user?.name || "—"} />
          <Detail label="Email" value={session?.user?.email || "—"} />
          <Detail label="Member" value="ÉLANORA Member" />
          <Detail label="Account type" value={session?.user?.role === "admin" ? "Administrator" : "Customer"} />
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-2xl">Recent Orders</h2>
          <Link href="/account/orders" className="eyebrow border-b border-espresso pb-1">View all</Link>
        </div>
        {orders.length === 0 ? (
          <p className="mt-6 text-espresso-soft">
            Your ÉLANORA story begins with your first piece.
          </p>
        ) : (
          <div className="mt-6 space-y-3">
            {orders.slice(0, 3).map((o) => (
              <Link
                key={o._id}
                href={`/account/orders/${o._id}`}
                className="flex items-center justify-between border border-line px-5 py-4 transition-colors hover:border-espresso"
              >
                <div>
                  <p className="text-sm">{o.reference}</p>
                  <p className="text-xs text-espresso-soft">
                    {new Date(o.createdAt).toLocaleDateString()} · {o.items.length} item(s)
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm">{money(o.total)}</p>
                  <p className="text-xs text-gold">{o.orderStatus}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-b border-line pb-4">
      <span className="eyebrow text-espresso-soft">{label}</span>
      <p className="mt-2">{value}</p>
    </div>
  );
}
