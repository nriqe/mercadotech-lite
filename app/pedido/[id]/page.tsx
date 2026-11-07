import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getDb, formatPEN } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function OrderPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const { id } = await params;
  const db = getDb();
  const order = db.prepare("SELECT * FROM orders WHERE id = ? AND user_id = ?").get(Number(id), user.id) as
    | { id: number; total: number; created_at: string }
    | undefined;
  if (!order) notFound();
  const items = db.prepare("SELECT * FROM order_items WHERE order_id = ?").all(order.id) as {
    id: number; title: string; price: number; quantity: number;
  }[];

  return (
    <div className="panel form form-wide">
      <h1 style={{ margin: 0 }}>¡Gracias por tu compra! 🎉</h1>
      <p className="muted">Pedido #{order.id} registrado el {order.created_at}. No se realizó ningún cobro.</p>
      {items.map((it) => (
        <div key={it.id} className="summary-row">
          <span>{it.quantity} × {it.title}</span>
          <span>{formatPEN(it.price * it.quantity)}</span>
        </div>
      ))}
      <div className="summary-row summary-total">
        <span>Total</span>
        <span>{formatPEN(order.total)}</span>
      </div>
      <Link href="/" className="btn">Seguir comprando</Link>
    </div>
  );
}
