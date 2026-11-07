import Link from "next/link";
import { getDb, formatPEN, type Product } from "@/lib/db";

export const dynamic = "force-dynamic";

export default function CatalogPage() {
  const products = getDb().prepare("SELECT * FROM products ORDER BY id DESC").all() as Product[];

  return (
    <>
      <section className="hero">
        <h1>Tecnología que te mueve</h1>
        <p className="muted">Laptops, celulares, audio y accesorios con envío a todo el Perú.</p>
      </section>
      <div className="grid">
        {products.map((p) => (
          <Link key={p.id} href={`/producto/${p.id}`} className="card">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p.image_url} alt={p.title} loading="lazy" />
            <div className="card-body">
              <span className="tag">{p.category}</span>
              <h2 className="card-title">{p.title}</h2>
              <span className="price">{formatPEN(p.price)}</span>
              {p.stock === 0 ? (
                <span className="stock-low">Agotado</span>
              ) : p.stock <= 5 ? (
                <span className="stock-low">¡Quedan {p.stock}!</span>
              ) : null}
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
