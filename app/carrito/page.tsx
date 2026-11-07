import Link from "next/link";
import { redirect } from "next/navigation";
import { getDb, formatPEN } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { updateCartItemAction } from "@/app/actions";
import CheckoutButton from "@/components/CheckoutButton";

export const dynamic = "force-dynamic";

type Row = { product_id: number; quantity: number; title: string; price: number; stock: number; image_url: string };

export default async function CartPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/carrito");

  const items = getDb()
    .prepare(
      `SELECT c.product_id, c.quantity, p.title, p.price, p.stock, p.image_url
       FROM cart_items c JOIN products p ON p.id = c.product_id
       WHERE c.user_id = ? ORDER BY c.id`
    )
    .all(user.id) as Row[];
  const total = items.reduce((s, it) => s + it.price * it.quantity, 0);

  if (items.length === 0) {
    return (
      <div className="panel form" style={{ textAlign: "center" }}>
        <h1 style={{ margin: 0 }}>Tu carrito está vacío</h1>
        <p className="muted">Explora el catálogo y agrega lo que te guste.</p>
        <Link href="/" className="btn">Ver productos</Link>
      </div>
    );
  }

  return (
    <>
      <h1>Tu carrito</h1>
      <div className="cart">
        <div className="panel">
          {items.map((it) => (
            <div key={it.product_id} className="cart-item">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={it.image_url} alt={it.title} />
              <div>
                <Link href={`/producto/${it.product_id}`} style={{ fontWeight: 600 }}>{it.title}</Link>
                <div className="muted">{formatPEN(it.price)} c/u</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div className="qty">
                  <form action={updateCartItemAction}>
                    <input type="hidden" name="productId" value={it.product_id} />
                    <input type="hidden" name="quantity" value={it.quantity - 1} />
                    <button aria-label="Quitar uno">−</button>
                  </form>
                  <span>{it.quantity}</span>
                  <form action={updateCartItemAction}>
                    <input type="hidden" name="productId" value={it.product_id} />
                    <input type="hidden" name="quantity" value={it.quantity + 1} />
                    <button aria-label="Agregar uno" disabled={it.quantity >= it.stock}>+</button>
                  </form>
                </div>
                <div style={{ fontWeight: 700, marginTop: 6 }}>{formatPEN(it.price * it.quantity)}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="panel">
          <h2 style={{ marginTop: 0 }}>Resumen</h2>
          <div className="summary-row"><span className="muted">Productos</span><span>{items.reduce((s, i) => s + i.quantity, 0)}</span></div>
          <div className="summary-row"><span className="muted">Envío</span><span>Gratis</span></div>
          <div className="summary-row summary-total"><span>Total</span><span>{formatPEN(total)}</span></div>
          <CheckoutButton />
          <p className="muted" style={{ fontSize: ".8rem" }}>Compra simulada: no se realiza ningún cobro.</p>
        </div>
      </div>
    </>
  );
}
