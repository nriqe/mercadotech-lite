"use client";

import { useActionState } from "react";
import { checkoutAction, type FormState } from "@/app/actions";

export default function CheckoutButton() {
  const [state, action, pending] = useActionState<FormState>(checkoutAction, undefined);
  return (
    <form action={action}>
      {state?.error && <p className="alert alert-error">{state.error}</p>}
      <button className="btn btn-block" disabled={pending}>
        {pending ? "Procesando…" : "Finalizar compra"}
      </button>
    </form>
  );
}
