import type { Metadata, Viewport } from "next";
import Link from "next/link";
import "./globals.css";
import { getCurrentUser } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { logoutAction } from "./actions";

export const metadata: Metadata = {
  title: "MercadoTech",
  description: "Tecnología al mejor precio, en soles.",
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#0f172a" };

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  const cartCount = user
    ? (getDb().prepare("SELECT COALESCE(SUM(quantity), 0) AS n FROM cart_items WHERE user_id = ?").get(user.id) as { n: number }).n
    : 0;

  return (
    <html lang="es">
      <body>
        <header className="header">
          <div className="container header-inner">
            <Link href="/" className="logo">
              Mercado<span>Tech</span>
            </Link>
            <nav className="nav">
              {user ? (
                <>
                  <Link href="/admin">Cargar productos</Link>
                  <span className="muted hide-sm">{user.name || user.email}</span>
                  <form action={logoutAction}>
                    <button className="link-btn">Salir</button>
                  </form>
                </>
              ) : (
                <>
                  <Link href="/login">Ingresar</Link>
                  <Link href="/registro" className="hide-sm">Crear cuenta</Link>
                </>
              )}
              <Link href="/carrito" className="cart-link" aria-label="Carrito">
                🛒 <span className="badge">{cartCount}</span>
              </Link>
            </nav>
          </div>
        </header>
        <main className="container main">{children}</main>
        <footer className="footer">
          <div className="container">© {new Date().getFullYear()} MercadoTech · Precios en soles (PEN)</div>
        </footer>
      </body>
    </html>
  );
}
