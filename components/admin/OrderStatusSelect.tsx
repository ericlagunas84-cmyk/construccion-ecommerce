"use client";

import { useTransition } from "react";
import { updateOrderStatus } from "@/lib/actions/orders";
import type { OrderStatus } from "@prisma/client";

const statuses: OrderStatus[] = ["PENDIENTE", "PAGADO", "PREPARANDO", "ENVIADO", "ENTREGADO", "CANCELADO"];

const statusStyles: Record<OrderStatus, string> = {
  PENDIENTE: "bg-brand-line text-brand-ink-soft",
  PAGADO: "bg-blue-50 text-brand-blue",
  PREPARANDO: "bg-orange-50 text-brand-orange",
  ENVIADO: "bg-purple-50 text-purple-700",
  ENTREGADO: "bg-emerald-50 text-emerald-700",
  CANCELADO: "bg-red-50 text-red-700",
};

export default function OrderStatusSelect({ orderId, status }: { orderId: string; status: OrderStatus }) {
  const [isPending, startTransition] = useTransition();

  return (
    <select
      value={status}
      disabled={isPending}
      onChange={(e) => startTransition(() => updateOrderStatus(orderId, e.target.value as OrderStatus))}
      className={`rounded px-2 py-1 text-xs font-medium ${statusStyles[status]} border-none focus:outline-none focus:ring-2 focus:ring-brand-blue`}
    >
      {statuses.map((s) => (
        <option key={s} value={s}>
          {s.charAt(0) + s.slice(1).toLowerCase()}
        </option>
      ))}
    </select>
  );
}
