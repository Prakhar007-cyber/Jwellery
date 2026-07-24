"use client";

import { useRouter } from "next/navigation";
import { useToast } from "@/components/providers/ToastProvider";
import { money } from "@/lib/constants";
import type { Order, OrderStatus } from "@/lib/types";

const STATUSES: OrderStatus[] = ["Processing", "Confirmed", "Shipped", "Delivered", "Cancelled"];

// Admin orders list with an inline status selector.
export function AdminOrdersTable({ orders }: { orders: (Order & { email?: string })[] }) {
  const router = useRouter();
  const toast = useToast();

  async function updateStatus(id: string, orderStatus: OrderStatus) {
    const res = await fetch(`/api/admin/orders/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderStatus }),
    });
    if (res.ok) {
      toast("Order status updated.");
      router.refresh();
    } else {
      toast("Could not update order.");
    }
  }

  if (orders.length === 0) {
    return <p className="text-espresso-soft">No orders yet.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[720px] text-sm">
        <thead>
          <tr className="border-b border-line text-left">
            <th className="pb-3 font-normal"><span className="eyebrow text-espresso-soft">Reference</span></th>
            <th className="pb-3 font-normal"><span className="eyebrow text-espresso-soft">Customer</span></th>
            <th className="pb-3 font-normal"><span className="eyebrow text-espresso-soft">Date</span></th>
            <th className="pb-3 font-normal"><span className="eyebrow text-espresso-soft">Total</span></th>
            <th className="pb-3 font-normal"><span className="eyebrow text-espresso-soft">Status</span></th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o._id} className="border-b border-line">
              <td className="py-3">{o.reference}</td>
              <td className="py-3 text-espresso-soft">{o.email || "—"}</td>
              <td className="py-3 text-espresso-soft">{new Date(o.createdAt).toLocaleDateString()}</td>
              <td className="py-3">{money(o.total)}</td>
              <td className="py-3">
                <select
                  value={o.orderStatus}
                  onChange={(e) => updateStatus(o._id, e.target.value as OrderStatus)}
                  className="border border-line bg-transparent px-2 py-1.5 text-sm outline-none focus:border-espresso"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
