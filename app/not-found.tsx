import Link from "next/link";

export default function NotFound() {
  return (
    <div className="panel form" style={{ textAlign: "center" }}>
      <h1 style={{ margin: 0 }}>No encontramos esa página</h1>
      <Link href="/" className="btn">Ir al catálogo</Link>
    </div>
  );
}
