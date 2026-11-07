import Database from "better-sqlite3";
import path from "node:path";
import fs from "node:fs";

const DB_PATH = path.join(process.cwd(), "data", "tienda.db");

export type Product = {
  id: number;
  title: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  image_url: string;
};

export type User = { id: number; email: string; password: string; name: string };

const SEED: Omit<Product, "id">[] = [
  { title: "Laptop UltraBook 14\"", description: "Procesador de 8 núcleos, 16 GB de RAM y SSD de 512 GB. Ligera y con batería para todo el día.", price: 3899, stock: 8, category: "Laptops", image_url: "https://placehold.co/600x450/1e293b/e2e8f0?text=UltraBook+14" },
  { title: "Laptop Gamer 16\"", description: "Pantalla de 165 Hz, tarjeta gráfica dedicada y teclado RGB.", price: 5499, stock: 5, category: "Laptops", image_url: "https://placehold.co/600x450/312e81/e0e7ff?text=Laptop+Gamer" },
  { title: "Smartphone Pro 256 GB", description: "Cámara triple de 50 MP, pantalla OLED de 6.7\" y carga rápida.", price: 2999, stock: 15, category: "Celulares", image_url: "https://placehold.co/600x450/0f172a/f1f5f9?text=Smartphone+Pro" },
  { title: "Smartphone Lite 128 GB", description: "Todo lo necesario a buen precio: batería de 5000 mAh y pantalla de 90 Hz.", price: 899, stock: 25, category: "Celulares", image_url: "https://placehold.co/600x450/134e4a/ccfbf1?text=Smartphone+Lite" },
  { title: "Audífonos inalámbricos ANC", description: "Cancelación activa de ruido y 30 horas de batería.", price: 649, stock: 20, category: "Audio", image_url: "https://placehold.co/600x450/3f3f46/fafafa?text=Audifonos+ANC" },
  { title: "Parlante Bluetooth portátil", description: "Resistente al agua IP67, sonido 360° y 12 horas de reproducción.", price: 329, stock: 18, category: "Audio", image_url: "https://placehold.co/600x450/7c2d12/ffedd5?text=Parlante" },
  { title: "Smartwatch Fit", description: "Monitor de ritmo cardíaco, GPS y más de 100 modos deportivos.", price: 549, stock: 12, category: "Wearables", image_url: "https://placehold.co/600x450/1e3a8a/dbeafe?text=Smartwatch" },
  { title: "Tablet 11\" 128 GB", description: "Ideal para estudiar y ver series. Compatible con lápiz digital.", price: 1499, stock: 10, category: "Tablets", image_url: "https://placehold.co/600x450/4c1d95/ede9fe?text=Tablet+11" },
  { title: "Monitor 27\" 4K", description: "Panel IPS con 99% sRGB, ideal para diseño y productividad.", price: 1299, stock: 7, category: "Monitores", image_url: "https://placehold.co/600x450/064e3b/d1fae5?text=Monitor+4K" },
  { title: "Teclado mecánico TKL", description: "Switches marrones, retroiluminación y cable USB-C desmontable.", price: 279, stock: 30, category: "Accesorios", image_url: "https://placehold.co/600x450/27272a/f4f4f5?text=Teclado+TKL" },
  { title: "Mouse inalámbrico ergonómico", description: "Sensor de 4000 DPI, silencioso y con batería recargable.", price: 149, stock: 40, category: "Accesorios", image_url: "https://placehold.co/600x450/0c4a6e/e0f2fe?text=Mouse" },
  { title: "Cámara web Full HD", description: "1080p a 60 fps con micrófono dual y corrección de luz automática.", price: 239, stock: 22, category: "Accesorios", image_url: "https://placehold.co/600x450/713f12/fef9c3?text=Camara+Web" },
];

declare global {
  // eslint-disable-next-line no-var
  var __db: Database.Database | undefined;
}

function init(db: Database.Database) {
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");
  db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      price REAL NOT NULL,
      stock INTEGER NOT NULL DEFAULT 0,
      category TEXT NOT NULL DEFAULT 'General',
      image_url TEXT NOT NULL DEFAULT ''
    );
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL DEFAULT '',
      password TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS sessions (
      token TEXT PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS cart_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
      quantity INTEGER NOT NULL DEFAULT 1,
      UNIQUE(user_id, product_id)
    );
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL REFERENCES users(id),
      total REAL NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
      product_id INTEGER NOT NULL REFERENCES products(id),
      title TEXT NOT NULL,
      price REAL NOT NULL,
      quantity INTEGER NOT NULL
    );
  `);

  const count = (db.prepare("SELECT COUNT(*) AS n FROM products").get() as { n: number }).n;
  if (count === 0) {
    const insert = db.prepare(
      "INSERT INTO products (title, description, price, stock, category, image_url) VALUES (@title, @description, @price, @stock, @category, @image_url)"
    );
    db.transaction(() => SEED.forEach((p) => insert.run(p)))();
  }
}

export function getDb(): Database.Database {
  if (!global.__db) {
    fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
    const db = new Database(DB_PATH);
    init(db);
    global.__db = db;
  }
  return global.__db;
}

export function formatPEN(amount: number) {
  return new Intl.NumberFormat("es-PE", { style: "currency", currency: "PEN" }).format(amount);
}
