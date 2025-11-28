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

      const data = Array.isArray(res.data?.data) ? res.data.data : [];

      const mapped: Order[] = data.map((o: any) => {
        const rawItems = Array.isArray(o.items) ? o.items : [];

        return {
          id: String(o.id),                       // FIX
          orderNumber: "#" + o.id,                // FIX
          customerName: o.customerName ?? "",
          type: o.type ?? "takeaway",

          status:
            o.status === "preparing" || o.status === "making"
              ? "brewing"
              : o.status === "waiting"
                ? "new"
                : o.status === "done" || o.status === "completed"
                  ? "done"
                  : "new",

          time: o.createdAt
            ? String(o.createdAt).substring(11, 16)
            : "",

          items: rawItems.map((i: any) => ({
            id: i.id,                             // FIX — giúp OrderCard không báo lỗi
            name: i.name,
            quantity: i.quantity,
            size: i.size ?? "",
            notes: i.notes ?? "",
          })),
        };
      });


      setOrders(mapped);
    } catch (error) {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // UPDATE STATUS
  // ==========================================
  const updateStatus = async (id: string, newStatus: OrderStatus) => {
    // 💡 LƯU Ý: Phải đảm bảo 'newStatus' được gửi từ OrderCard.tsx khớp với API endpoint
    // Nếu bạn muốn 'new' -> 'brewing' (UI), bạn cần:
    // 1. OrderCard gửi trạng thái API tương ứng với '/start-making'.
    // 2. OrderCard gửi trạng thái 'done' cho hành động hoàn tất.

    await BaristaOrderAPI.updateStatus(
      Number(id),
      // newStatus sẽ là 'brewing' (để gọi start-making) hoặc 'done'
      newStatus as "brewing" | "done"
    );

    // Cập nhật trạng thái ngay lập tức trên UI (trước khi refresh)
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
    );

    // Nếu bạn muốn đơn hàng chuyển từ tab này sang tab khác ngay lập tức, bạn phải 
    // đảm bảo gọi refresh() sau khi updateStatus thành công (như đã làm trong PhaChe.tsx).
    // Nếu bạn gọi refresh ở đây, nó sẽ gây loop vô hạn nếu hook khác cũng gọi update.
    // Tốt nhất nên để component gọi refresh.
  };

  useEffect(() => {
    loadOrders();
  }, []);

  return {
    orders,
    loading,
    updateStatus,
    refresh: loadOrders,

    // Logic filtering này đã chính xác vì nó dựa trên mapping đã sửa
    newOrders: orders.filter((o) => o.status === "new"),
    brewingOrders: orders.filter((o) => o.status === "brewing"),
    doneOrders: orders.filter((o) => o.status === "done"),
  };
};