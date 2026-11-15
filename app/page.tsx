import Link from "next/link";
import { formatPEN } from "@/lib/db";
import { getCatalogPage } from "@/lib/catalog";

export const dynamic = "force-dynamic";

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function catalogHref(category: string | null, page: number) {
  const params = new URLSearchParams();
  if (category) params.set("categoria", category);
  if (page > 1) params.set("pagina", String(page));
  const qs = params.toString();
  return qs ? `/?${qs}` : "/";
}

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const sp = await searchParams;
  const { categories, selectedCategory: selected, products, page, totalPages } = getCatalogPage(
    first(sp.categoria) ?? null,
    Number(first(sp.pagina) ?? "1")
  );

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
        <nav className="pagination" aria-label="Páginas del catálogo">
          <Link
            href={catalogHref(selected, page - 1)}
            className={`chip${page === 1 ? " chip-disabled" : ""}`}
            aria-disabled={page === 1}
            tabIndex={page === 1 ? -1 : undefined}
          >
            ← Anterior
          </Link>
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
          <Link
            href={catalogHref(selected, page + 1)}
            className={`chip${page === totalPages ? " chip-disabled" : ""}`}
            aria-disabled={page === totalPages}
            tabIndex={page === totalPages ? -1 : undefined}
          >
            Siguiente →
          </Link>
        </nav>
      )}
    </>
  );
}
