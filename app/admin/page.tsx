import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import ProductForm from "@/components/ProductForm";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/admin");
  return <ProductForm />;
}
