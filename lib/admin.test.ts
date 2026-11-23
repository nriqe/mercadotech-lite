import { describe, expect, it } from "vitest";
import { isAdmin } from "./admin";

const LISTA = "admin@ejemplo.com, jefa@ejemplo.com";

describe("isAdmin", () => {
  it("es administrador un correo que está en la lista", () => {
    expect(isAdmin({ email: "jefa@ejemplo.com" }, LISTA)).toBe(true);
  });

  it("ignora mayúsculas y espacios alrededor", () => {
    expect(isAdmin({ email: "ADMIN@Ejemplo.com" }, LISTA)).toBe(true);
  });

  it("no es administrador un correo que no está en la lista", () => {
    expect(isAdmin({ email: "cliente@ejemplo.com" }, LISTA)).toBe(false);
  });

  it("falla cerrado: con la variable vacía o ausente, nadie es administrador", () => {
    expect(isAdmin({ email: "admin@ejemplo.com" }, "")).toBe(false);
    expect(isAdmin({ email: "admin@ejemplo.com" }, "  , ")).toBe(false);
    expect(isAdmin({ email: "admin@ejemplo.com" }, undefined)).toBe(false);
  });

  it("sin usuario no hay administrador", () => {
    expect(isAdmin(null, LISTA)).toBe(false);
  });
});
