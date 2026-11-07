"use client";

import { useActionState, useEffect, useRef } from "react";
import { createProductAction, type FormState } from "@/app/actions";

export default function ProductForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(createProductAction, undefined);
  const ref = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (state?.ok) ref.current?.reset();
  }, [state]);

  return (
    <form ref={ref} action={action} className="panel form form-wide">
      <h1 style={{ margin: 0 }}>Cargar producto</h1>
      {state?.error && <p className="alert alert-error">{state.error}</p>}
      {state?.ok && <p className="alert alert-ok">{state.ok}</p>}
      <label className="field">Nombre<input name="title" required /></label>
      <label className="field">Descripción<textarea name="description" rows={3} /></label>
      <div className="row">
        <label className="field">Precio (S/)<input name="price" type="number" step="0.01" min="0.01" required /></label>
        <label className="field">Stock<input name="stock" type="number" step="1" min="0" required /></label>
      </div>
      <div className="row">
        <label className="field">Categoría<input name="category" placeholder="Ej. Accesorios" /></label>
        <label className="field">URL de imagen<input name="image_url" type="url" placeholder="https://…" /></label>
      </div>
      <button className="btn" disabled={pending}>{pending ? "Guardando…" : "Guardar producto"}</button>
    </form>
  );
}
