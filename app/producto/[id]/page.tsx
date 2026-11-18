import Link from "next/link";
import { notFound } from "next/navigation";
import { getDb, formatPEN, type Product } from "@/lib/db";
import { addToCartAction } from "@/app/actions";
import { LOW_STOCK_THRESHOLD } from "@/lib/constants/catalog";

export const dynamic = "force-dynamic";

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const p = getDb().prepare("SELECT * FROM products WHERE id = ?").get(Number(id)) as Product | undefined;
  if (!p) notFound();

  return (
    <>
      <p><Link href="/" className="muted">← Volver al catálogo</Link></p>
      <div className="detail">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={p.image_url} alt={p.title} />
        <div>
          <span className="tag">{p.category}</span>
          <h1>{p.title}</h1>
          <p className="muted">{p.description}</p>
          <div className="price">{formatPEN(p.price)}</div>
          <p className={p.stock <= LOW_STOCK_THRESHOLD ? "stock-low" : "muted"}>
            {p.stock > 0 ? `${p.stock} unidades disponibles` : "Agotado"}
          </p>
          <form action={addToCartAction} className="row" style={{ alignItems: "end" }}>
            <input type="hidden" name="productId" value={p.id} />
            <label className="field">
              Cantidad
              <input type="number" name="quantity" min={1} max={Math.max(1, p.stock)} defaultValue={1} disabled={p.stock === 0} />
            </label>
            <button className="btn" disabled={p.stock === 0}>Agregar al carrito</button>
          </form>
        </div>
      </div>
    </>
  );
}
