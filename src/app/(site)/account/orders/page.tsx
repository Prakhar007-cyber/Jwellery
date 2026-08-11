import { auth } from "@/lib/auth";
import { getUserOrders } from "@/lib/orders";
import Link from "next/link";
import { money } from "@/lib/constants";

// Order history list.
export default async function OrdersPage() {
  const session = await auth();
  const orders = session?.user?.id ? await getUserOrders(session.user.id) : [];

  return (
    <div>
      <h2 className="font-serif text-2xl">Order History</h2>

      {orders.length === 0 ? (
        <div className="mt-10 flex flex-col items-start">
          <p className="display text-3xl">Your ÉLANORA story begins with your first piece.</p>
          <Link href="/shop" className="eyebrow mt-6 border-b border-espresso pb-1">Explore the collection</Link>
        </div>
      ) : (
        <div className="mt-8 overflow-x-auto">
          <table className="w-full min-w-140 text-sm">
            <thead>
              <tr className="border-b border-line text-left">
                <th className="pb-3 font-normal"><span className="eyebrow text-espresso-soft">Order</span></th>
                <th className="pb-3 font-normal"><span className="eyebrow text-espresso-soft">Date</span></th>
                <th className="pb-3 font-normal"><span className="eyebrow text-espresso-soft">Total</span></th>
                <th className="pb-3 font-normal"><span className="eyebrow text-espresso-soft">Status</span></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o._id} className="border-b border-line">
                  <td className="py-4">{o.reference}</td>
                  <td className="py-4 text-espresso-soft">{new Date(o.createdAt).toLocaleDateString()}</td>
                  <td className="py-4">{money(o.total)}</td>
                  <td className="py-4"><span className="text-gold">{o.orderStatus}</span></td>
                  <td className="py-4 text-right">
                    <Link href={`/account/orders/${o._id}`} className="eyebrow border-b border-espresso pb-0.5">View</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
