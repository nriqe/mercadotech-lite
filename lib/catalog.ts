import { getDb, type Product } from "@/lib/db";
import { PRODUCTS_PER_PAGE } from "@/lib/constants/catalog";

export type CatalogPage = {
  categories: string[];
  selectedCategory: string | null;
  products: Product[];
  page: number;
  totalPages: number;
};

/**
 * Datos del catálogo para una categoría (o todas) y un número de página.
 * Una categoría desconocida se ignora; una página fuera de rango se ajusta
 * a la primera o a la última.
 */
export function getCatalogPage(requestedCategory: string | null, requestedPage: number): CatalogPage {
  const db = getDb();
  const categories = (
    db.prepare("SELECT DISTINCT category FROM products ORDER BY category").all() as { category: string }[]
  ).map((r) => r.category);

  const selectedCategory =
    requestedCategory && categories.includes(requestedCategory) ? requestedCategory : null;

  const where = selectedCategory ? "WHERE category = ?" : "";
  const params = selectedCategory ? [selectedCategory] : [];

  const total = (db.prepare(`SELECT COUNT(*) AS n FROM products ${where}`).get(...params) as { n: number }).n;
  const totalPages = Math.max(1, Math.ceil(total / PRODUCTS_PER_PAGE));
  const page = Math.min(Math.max(1, Number.isInteger(requestedPage) ? requestedPage : 1), totalPages);

  const products = db
    .prepare(`SELECT * FROM products ${where} ORDER BY id DESC LIMIT ? OFFSET ?`)
    .all(...params, PRODUCTS_PER_PAGE, (page - 1) * PRODUCTS_PER_PAGE) as Product[];

  return { categories, selectedCategory, products, page, totalPages };
}
