import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { getOrderById } from "@/lib/orders";
import { money } from "@/lib/constants";

// Full order detail (scoped to the signed-in user).
export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  const order = session?.user?.id ? await getOrderById(id, session.user.id) : null;
  if (!order) notFound();

  return (
    <div>
      <Link href="/account/orders" className="eyebrow text-espresso-soft hover:text-espresso">← Back to orders</Link>

      <div className="mt-6 flex flex-wrap items-end justify-between gap-4 border-b border-line pb-6">
        <div>
          <span className="eyebrow text-gold">{order.orderStatus}</span>
          <h2 className="display mt-2 text-4xl">{order.reference}</h2>
          <p className="mt-1 text-sm text-espresso-soft">
            Placed on {new Date(order.createdAt).toLocaleDateString()}
          </p>
        </div>
        <p className="font-serif text-2xl">{money(order.total)}</p>
      </div>

      {/* Items */}
      <div className="mt-8 space-y-4">
        {order.items.map((item, i) => (
          <div key={i} className="flex gap-4 border-b border-line pb-4">
            <div className="relative h-20 w-16 shrink-0 overflow-hidden bg-pearl">
              {item.image && <Image src={item.image} alt={item.name} fill sizes="64px" className="object-cover" />}
            </div>
            <div className="flex flex-1 justify-between">
              <div>
                <p className="font-serif text-lg">{item.name}</p>
                <p className="text-sm text-espresso-soft">Qty {item.quantity}{item.size ? ` · Size ${item.size}` : ""}</p>
              </div>
              <span className="text-sm">{money(item.price * item.quantity)}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Totals + shipping */}
      <div className="mt-8 grid gap-8 sm:grid-cols-2">
        <div>
          <span className="eyebrow text-espresso-soft">Shipping to</span>
          <p className="mt-3 text-sm">{order.shippingAddress?.name}</p>
          <p className="text-sm text-espresso-soft">
            {order.shippingAddress?.line1}, {order.shippingAddress?.city}, {order.shippingAddress?.state}{" "}
            {order.shippingAddress?.postalCode}, {order.shippingAddress?.country}
          </p>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-espresso-soft">Subtotal</span><span>{money(order.subtotal)}</span></div>
          <div className="flex justify-between"><span className="text-espresso-soft">Shipping</span><span>{order.shipping === 0 ? "Complimentary" : money(order.shipping)}</span></div>
          <div className="flex justify-between border-t border-line pt-2 font-serif text-lg"><span>Total</span><span>{money(order.total)}</span></div>
        </div>
      </div>
    </div>
  );
}
