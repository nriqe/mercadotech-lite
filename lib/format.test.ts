import { describe, expect, it } from "vitest";
import { formatPEN } from "./format";

// El símbolo y el número van separados por un espacio no separable (U+00A0), no por uno común.
const NBSP = " ";

describe("formatPEN", () => {
  it("formatea un monto con miles y decimales como soles: 1234.5 -> S/ 1,234.50", () => {
    expect(formatPEN(1234.5)).toBe(`S/${NBSP}1,234.50`);
  });

  it("muestra el cero con dos decimales: 0 -> S/ 0.00", () => {
    expect(formatPEN(0)).toBe(`S/${NBSP}0.00`);
  });

  it("separa el símbolo del número con un espacio no separable, no con uno común", () => {
    expect(formatPEN(10)).toContain(`S/${NBSP}`);
    expect(formatPEN(10)).not.toContain("S/ ");
  });
});
