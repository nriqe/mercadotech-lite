import { getDb, type Product } from "@/lib/db";
import { PRODUCTS_PER_PAGE } from "@/lib/constants/catalog";

export function getCategories(): string[] {
  const rows = getDb()
    .prepare("SELECT DISTINCT category FROM products ORDER BY category")
    .all() as { category: string }[];
  return rows.map((r) => r.category);
}

export function getCatalogPage(category: string | null, requestedPage: number) {
  const db = getDb();
  const where = category ? "WHERE category = ?" : "";
  const params = category ? [category] : [];
  const { total } = db.prepare(`SELECT COUNT(*) AS total FROM products ${where}`).get(...params) as { total: number };
  const totalPages = Math.max(1, Math.ceil(total / PRODUCTS_PER_PAGE));
  const page = Math.min(Math.max(1, requestedPage), totalPages);
  const products = db
    .prepare(`SELECT * FROM products ${where} ORDER BY id DESC LIMIT ? OFFSET ?`)
    .all(...params, PRODUCTS_PER_PAGE, (page - 1) * PRODUCTS_PER_PAGE) as Product[];
  return { products, page, totalPages };
}
