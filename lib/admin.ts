/**
 * ¿Es administrador este usuario? Compara su correo con ADMIN_EMAILS
 * (correos separados por coma). Sin la variable, nadie es administrador.
 */
export function isAdmin(
  user: { email: string } | null | undefined,
  adminEmails: string | undefined = process.env.ADMIN_EMAILS
): boolean {
  if (!user || !adminEmails) return false;
  const email = user.email.trim().toLowerCase();
  if (!email) return false;
  return adminEmails
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)
    .includes(email);
}
