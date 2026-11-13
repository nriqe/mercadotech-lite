import Link from "next/link";
import { getDb, formatPEN, type Product } from "@/lib/db";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 6;

function first(v: string | string[] | undefined) {
  return Array.isArray(v) ? v[0] : v;
}

function catalogHref(categoria: string | null, pagina: number) {
  const params = new URLSearchParams();
  if (categoria) params.set("categoria", categoria);
  if (pagina > 1) params.set("pagina", String(pagina));
  const qs = params.toString();
  return qs ? `/?${qs}` : "/";
}

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const db = getDb();
  const categories = (
    db.prepare("SELECT DISTINCT category FROM products ORDER BY category").all() as { category: string }[]
  ).map((r) => r.category);

  const params = await searchParams;
  const requested = first(params.categoria);
  const selected = requested && categories.includes(requested) ? requested : null;

  const where = selected ? "WHERE category = ?" : "";
  const filter = selected ? [selected] : [];
  const total = (db.prepare(`SELECT COUNT(*) AS n FROM products ${where}`).get(...filter) as { n: number }).n;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const requestedPage = Number.parseInt(first(params.pagina) ?? "1", 10);
  const page = Number.isFinite(requestedPage) ? Math.min(Math.max(requestedPage, 1), totalPages) : 1;

  const products = db
    .prepare(`SELECT * FROM products ${where} ORDER BY id DESC LIMIT ? OFFSET ?`)
    .all(...filter, PAGE_SIZE, (page - 1) * PAGE_SIZE) as Product[];

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
            href={catalogHref(c, 1)}
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
      {totalPages > 1 && (
        <nav className="pagination" aria-label="Paginación del catálogo">
          {page > 1 ? (
            <Link href={catalogHref(selected, page - 1)} className="chip" rel="prev">
              ← Anterior
            </Link>
          ) : (
            <span className="chip chip-disabled" aria-disabled="true">← Anterior</span>
          )}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <Link
              key={n}
              href={catalogHref(selected, n)}
              className={`chip${n === page ? " chip-active" : ""}`}
              aria-current={n === page ? "page" : undefined}
            >
              {n}
            </Link>
          ))}
          {page < totalPages ? (
            <Link href={catalogHref(selected, page + 1)} className="chip" rel="next">
              Siguiente →
            </Link>
          ) : (
            <span className="chip chip-disabled" aria-disabled="true">Siguiente →</span>
          )}
        </nav>
      )}
    </>
  );
}
