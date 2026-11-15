import { getDb, type Product } from "@/lib/db";
import { PRODUCTS_PER_PAGE } from "@/lib/constants/catalog";

export type CatalogPage = {
  products: Product[];
  page: number;
  totalPages: number;
};

export function getCategories(): string[] {
  return (
    getDb().prepare("SELECT DISTINCT category FROM products ORDER BY category").all() as { category: string }[]
  ).map((r) => r.category);
}

/** Devuelve una página del catálogo. Una página fuera de rango se lleva a la más cercana. */
export function getCatalogPage(category: string | null, requestedPage: number): CatalogPage {
  const db = getDb();
  const where = category ? "WHERE category = ?" : "";
  const args = category ? [category] : [];

  const total = (db.prepare(`SELECT COUNT(*) AS n FROM products ${where}`).get(...args) as { n: number }).n;
  const totalPages = Math.max(1, Math.ceil(total / PRODUCTS_PER_PAGE));
  const page = Math.min(Math.max(1, requestedPage), totalPages);

  const products = db
    .prepare(`SELECT * FROM products ${where} ORDER BY id DESC LIMIT ? OFFSET ?`)
    .all(...args, PRODUCTS_PER_PAGE, (page - 1) * PRODUCTS_PER_PAGE) as Product[];

  return { products, page, totalPages };
}
