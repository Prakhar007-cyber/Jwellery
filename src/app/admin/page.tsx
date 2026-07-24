import { connectDB } from "@/lib/db";
import { Product } from "@/lib/models/Product";
import { User } from "@/lib/models/User";
import { getAllOrders } from "@/lib/orders";
import { money } from "@/lib/constants";
import Link from "next/link";

// Admin dashboard overview — headline stats + latest orders.
export default async function AdminDashboard() {
  await connectDB();
  const [productCount, userCount, orders] = await Promise.all([
    Product.estimatedDocumentCount(),
    User.estimatedDocumentCount(),
    getAllOrders(),
  ]);

  const revenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);

  const stats = [
    { label: "Products", value: productCount },
    { label: "Orders", value: orders.length },
    { label: "Customers", value: userCount },
    { label: "Revenue", value: money(revenue) },
  ];

  return (
    <div>
      <h1 className="display text-4xl">Dashboard</h1>

      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="border border-line p-6">
            <span className="eyebrow text-espresso-soft">{s.label}</span>
            <p className="mt-3 font-serif text-4xl">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-12">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-2xl">Latest Orders</h2>
          <Link href="/admin/orders" className="eyebrow border-b border-espresso pb-1">View all</Link>
        </div>
        {orders.length === 0 ? (
          <p className="mt-6 text-espresso-soft">No orders yet.</p>
        ) : (
          <div className="mt-6 space-y-2">
            {orders.slice(0, 5).map((o) => (
              <div key={o._id} className="flex items-center justify-between border border-line px-5 py-4 text-sm">
                <span>{o.reference}</span>
                <span className="text-espresso-soft">{o.email}</span>
                <span className="text-gold">{o.orderStatus}</span>
                <span>{money(o.total)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
