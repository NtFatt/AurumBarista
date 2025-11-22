import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Order } from "@/components/OrderCard";
import { OrderBoard } from "@/modules/orders/OrderBoard";

export default function DonMoi() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = async () => {
    try {
      const res = await api.get("/admin/workflow/barista-orders");
      const list = res.data.data || [];
const mapped: Order[] = list.map((o: any) => ({
  id: o.Id.toString(),
  orderNumber: "#" + o.Id,
  customerName: o.UserId ?? "Khách lẻ",
  type: "take-away",
  status: o.Status === "Accepted" ? "new" : "making",
  time: o.CreatedAt.substring(11, 16),

  items: (o.Items || []).map((i: any) => ({
    name: i.ProductName,
    size: i.Size,
    quantity: i.Quantity
  }))
}));


      setOrders(mapped);
    } catch (err) {
      console.error("FAILED LOAD BARISTA NEW ORDERS", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();

    // Auto refresh 10s một lần
    const timer = setInterval(() => loadOrders(), 10000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Đơn mới</h1>

      {loading ? (
        <p>Đang tải...</p>
      ) : (
        <OrderBoard orders={orders} onUpdateStatus={loadOrders} />
      )}
    </div>
  );
}
