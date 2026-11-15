import Link from "next/link";
import { formatPEN } from "@/lib/db";
import { getCategories, getCatalogPage } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const categories = getCategories();
  const params = await searchParams;

  const rawCat = params.categoria;
  const requested = Array.isArray(rawCat) ? rawCat[0] : rawCat;
  const selected = requested && categories.includes(requested) ? requested : null;

  const rawPage = params.pagina;
  const pageNum = parseInt((Array.isArray(rawPage) ? rawPage[0] : rawPage) ?? "1", 10);
  const { products, page, totalPages } = getCatalogPage(selected, Number.isNaN(pageNum) ? 1 : pageNum);

  const pageHref = (n: number) => {
    const q = new URLSearchParams();
    if (selected) q.set("categoria", selected);
    if (n > 1) q.set("pagina", String(n));
    const qs = q.toString();
    return qs ? `/?${qs}` : "/";
  };

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
      {totalPages > 1 && (
        <nav className="filters" aria-label="Paginación">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <Link
              key={n}
              href={pageHref(n)}
              className={`chip${n === page ? " chip-active" : ""}`}
              aria-current={n === page ? "page" : undefined}
            >
              {n}
            </Link>
          ))}
        </nav>
      )}
    </>
  );
}
