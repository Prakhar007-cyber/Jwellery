import { getAllOrders } from "@/lib/orders";
import { AdminOrdersTable } from "@/components/admin/AdminOrdersTable";

// Admin orders management.
export default async function AdminOrdersPage() {
  const orders = await getAllOrders();
  return (
    <div>
      <h1 className="display mb-8 text-4xl">Orders</h1>
      <AdminOrdersTable orders={orders} />
    </div>
  );
}
