"use client";

import Link from "next/link";
import { useActionState } from "react";
import { loginAction, registerAction, type FormState } from "@/app/actions";

export default function AuthForm({ mode, next }: { mode: "login" | "register"; next?: string }) {
  const [state, action, pending] = useActionState<FormState, FormData>(
    mode === "login" ? loginAction : registerAction,
    undefined
  );
  const isLogin = mode === "login";

  return (
    <form action={action} className="panel form">
      <h1 style={{ margin: 0 }}>{isLogin ? "Ingresar" : "Crear cuenta"}</h1>
      {state?.error && <p className="alert alert-error">{state.error}</p>}
      {!isLogin && (
        <label className="field">
          Nombre
          <input name="name" autoComplete="name" />
        </label>
      )}
      <label className="field">
        Correo
        <input name="email" type="email" required autoComplete="email" />
      </label>
      <label className="field">
        Contraseña
        <input name="password" type="password" required minLength={6} autoComplete={isLogin ? "current-password" : "new-password"} />
      </label>
      {next && <input type="hidden" name="next" value={next} />}
      <button className="btn btn-block" disabled={pending}>
        {pending ? "Un momento…" : isLogin ? "Ingresar" : "Registrarme"}
      </button>
      <p className="muted" style={{ textAlign: "center", margin: 0 }}>
        {isLogin ? (
          <>¿No tienes cuenta? <Link href="/registro" style={{ color: "var(--primary)" }}>Regístrate</Link></>
        ) : (
          <>¿Ya tienes cuenta? <Link href="/login" style={{ color: "var(--primary)" }}>Ingresa</Link></>
        )}
      </p>
    </form>
  );
}
