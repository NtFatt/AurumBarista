import { useEffect, useState } from "react";
import { BaristaOrderAPI } from "@/services/baristaOrder.api";
import { Order, OrderStatus } from "@/components/OrderCard";

export const useBaristaOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // ==========================================
  // LOAD ORDERS TỪ BE
  // ==========================================
  const loadOrders = async () => {
    try {
      setLoading(true);

      const res = await BaristaOrderAPI.getOrders();

      // LUÔN LẤY MẢNG CHO CHẮC
      const data = Array.isArray(res.data?.data) ? res.data.data : [];

      const mapped: Order[] = data.map((o: any) => {
        const rawItems = Array.isArray(o.Items) ? o.Items : [];

        return {
          id: String(o.Id),
          orderNumber: "#" + o.Id,

          customerName: o.CustomerName ?? "",

          type: o.Type ?? "takeaway",

          // MAP STATUS CHUẨN
          status:
            o.Status === "accepted" || o.Status === "making"
              ? ("done" as OrderStatus)

              : o.Status?.toLowerCase() === "done"
                ? ("done" as OrderStatus)
                : ("new" as OrderStatus),

          time:
            typeof o.CreatedAt === "string"
              ? o.CreatedAt.substring(11, 16)
              : "",

          // ITEMS
          items: rawItems.map((i: any) => ({
            name: i.ProductName,
            quantity: i.Quantity,
            size: i.Size ?? null,
            notes: i.Notes ?? "",
          })),
        };
      });

      setOrders(mapped);
    } catch (error) {
      console.error("LOAD BARISTA ORDERS ERROR:", error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // UPDATE STATUS
  // ==========================================
  const updateStatus = async (id: string, newStatus: OrderStatus) => {
    if (newStatus === "new") return;

    await BaristaOrderAPI.updateStatus(
      Number(id),
      newStatus as "brewing" | "done"
    );

    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
    );
  };

  useEffect(() => {
    loadOrders();
  }, []);

  return {
    orders,
    loading,
    updateStatus,
    refresh: loadOrders,

    newOrders: orders.filter((o) => o.status === "new"),
    brewingOrders: orders.filter((o) => o.status === "brewing"),
    doneOrders: orders.filter((o) => o.status === "done"),
  };
};
