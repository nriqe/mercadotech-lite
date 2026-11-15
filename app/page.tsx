import Link from "next/link";
import { getDb, formatPEN, type Product } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const db = getDb();
  const categories = (
    db.prepare("SELECT DISTINCT category FROM products ORDER BY category").all() as { category: string }[]
  ).map((r) => r.category);

  const raw = (await searchParams).categoria;
  const requested = Array.isArray(raw) ? raw[0] : raw;
  const selected = requested && categories.includes(requested) ? requested : null;

  const products = (
    selected
      ? db.prepare("SELECT * FROM products WHERE category = ? ORDER BY id DESC").all(selected)
      : db.prepare("SELECT * FROM products ORDER BY id DESC").all()
  ) as Product[];

  return (
    <>
      <section className="hero">
        <h1>Tecnología que te mueve</h1>
        <p className="muted">Laptops, celulares, audio y accesorios con envío a todo el Perú.</p>
      </section>
      <nav className="filters" aria-label="Filtrar por categoría">
        <Link href="/" className={`chip${selected ? "" : " chip-active"}`} aria-current={selected ? undefined : "page"}>
          Todas
        </Link>
        {categories.map((c) => (
          <Link
            key={c}
            href={`/?categoria=${encodeURIComponent(c)}`}
            className={`chip${selected === c ? " chip-active" : ""}`}
            aria-current={selected === c ? "page" : undefined}
          >
            {c}
          </Link>
        ))}
      </nav>
      {products.length === 0 && <p className="muted">No hay productos en esta categoría.</p>}
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
