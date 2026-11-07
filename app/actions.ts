"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getDb, type Product } from "@/lib/db";
import {
  createSession,
  destroySession,
  getCurrentUser,
  hashPassword,
  verifyPassword,
} from "@/lib/auth";

export type FormState = { error?: string; ok?: string } | undefined;

export async function registerAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !email.includes("@")) return { error: "Ingresa un correo válido." };
  if (password.length < 6) return { error: "La contraseña debe tener al menos 6 caracteres." };

  const db = getDb();
  const exists = db.prepare("SELECT id FROM users WHERE email = ?").get(email);
  if (exists) return { error: "Ya existe una cuenta con ese correo." };

  const info = db
    .prepare("INSERT INTO users (email, name, password) VALUES (?, ?, ?)")
    .run(email, name, hashPassword(password));
  await createSession(Number(info.lastInsertRowid));
  redirect("/");
}

export async function loginAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const user = getDb().prepare("SELECT id, password FROM users WHERE email = ?").get(email) as
    | { id: number; password: string }
    | undefined;
  if (!user || !verifyPassword(password, user.password)) {
    return { error: "Correo o contraseña incorrectos." };
  }
  await createSession(user.id);
  const next = String(formData.get("next") ?? "/");
  redirect(next.startsWith("/") ? next : "/");
}

export async function logoutAction() {
  await destroySession();
  redirect("/");
}

export async function addToCartAction(formData: FormData) {
  const user = await getCurrentUser();
  const productId = Number(formData.get("productId"));
  const quantity = Math.max(1, Number(formData.get("quantity") ?? 1));
  if (!user) redirect(`/login?next=/producto/${productId}`);

  const db = getDb();
  const product = db.prepare("SELECT stock FROM products WHERE id = ?").get(productId) as
    | { stock: number }
    | undefined;
  if (!product || product.stock <= 0) redirect(`/producto/${productId}`);

  const current = db
    .prepare("SELECT quantity FROM cart_items WHERE user_id = ? AND product_id = ?")
    .get(user.id, productId) as { quantity: number } | undefined;
  const newQty = Math.min(product.stock, (current?.quantity ?? 0) + quantity);

  db.prepare(
    `INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)
     ON CONFLICT(user_id, product_id) DO UPDATE SET quantity = excluded.quantity`
  ).run(user.id, productId, newQty);

  revalidatePath("/", "layout");
  redirect("/carrito");
}

export async function updateCartItemAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const productId = Number(formData.get("productId"));
  const quantity = Number(formData.get("quantity"));
  const db = getDb();
  if (quantity <= 0) {
    db.prepare("DELETE FROM cart_items WHERE user_id = ? AND product_id = ?").run(user.id, productId);
  } else {
    const p = db.prepare("SELECT stock FROM products WHERE id = ?").get(productId) as { stock: number };
    db.prepare("UPDATE cart_items SET quantity = ? WHERE user_id = ? AND product_id = ?").run(
      Math.min(quantity, p.stock),
      user.id,
      productId
    );
  }
  revalidatePath("/", "layout");
}

export async function checkoutAction(_prev: FormState): Promise<FormState> {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/carrito");

  const db = getDb();
  let orderId = 0;
  try {
    orderId = db.transaction(() => {
      const items = db
        .prepare(
          `SELECT c.product_id, c.quantity, p.title, p.price, p.stock
           FROM cart_items c JOIN products p ON p.id = c.product_id
           WHERE c.user_id = ?`
        )
        .all(user.id) as { product_id: number; quantity: number; title: string; price: number; stock: number }[];

      if (items.length === 0) throw new Error("Tu carrito está vacío.");
      for (const it of items) {
        if (it.quantity > it.stock) throw new Error(`No hay stock suficiente de "${it.title}".`);
      }

      const total = items.reduce((sum, it) => sum + it.price * it.quantity, 0);
      const order = db.prepare("INSERT INTO orders (user_id, total) VALUES (?, ?)").run(user.id, total);
      const id = Number(order.lastInsertRowid);
      const insertItem = db.prepare(
        "INSERT INTO order_items (order_id, product_id, title, price, quantity) VALUES (?, ?, ?, ?, ?)"
      );
      const decrement = db.prepare("UPDATE products SET stock = stock - ? WHERE id = ?");
      for (const it of items) {
        insertItem.run(id, it.product_id, it.title, it.price, it.quantity);
        decrement.run(it.quantity, it.product_id);
      }
      db.prepare("DELETE FROM cart_items WHERE user_id = ?").run(user.id);
      return id;
    })();
  } catch (e) {
    return { error: e instanceof Error ? e.message : "No se pudo completar la compra." };
  }

  revalidatePath("/", "layout");
  redirect(`/pedido/${orderId}`);
}

export async function createProductAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/admin");

  const p: Omit<Product, "id"> = {
    title: String(formData.get("title") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    price: Number(formData.get("price")),
    stock: Number(formData.get("stock")),
    category: String(formData.get("category") ?? "").trim() || "General",
    image_url: String(formData.get("image_url") ?? "").trim(),
  };

  if (!p.title) return { error: "El nombre es obligatorio." };
  if (!Number.isFinite(p.price) || p.price <= 0) return { error: "El precio debe ser mayor a 0." };
  if (!Number.isInteger(p.stock) || p.stock < 0) return { error: "El stock debe ser un número entero." };
  if (!p.image_url) {
    p.image_url = `https://placehold.co/600x450/1e293b/e2e8f0?text=${encodeURIComponent(p.title)}`;
  }

  getDb()
    .prepare(
      "INSERT INTO products (title, description, price, stock, category, image_url) VALUES (@title, @description, @price, @stock, @category, @image_url)"
    )
    .run(p);

  revalidatePath("/", "layout");
  return { ok: `Producto "${p.title}" creado.` };
}
