#!/usr/bin/env node
// Servidor MCP mínimo, SOLO LECTURA, sin dependencias. Una sola herramienta:
// lista metadatos (nombre, tamaño, fecha) de los .jsonl de una carpeta. No lee contenido, no escribe.
import { readdir, stat } from "node:fs/promises";
import { join } from "node:path";
import { createInterface } from "node:readline";

const args = process.argv.slice(2);
const DIR = args.find((a) => !a.startsWith("--"));
if (!args.includes("--read-only") || !DIR) {
  console.error("uso: conversaciones-ro.mjs --read-only <carpeta>  (se niega a arrancar sin --read-only)");
  process.exit(1);
}

const TOOL = {
  name: "list_conversations",
  description: "Lista las conversaciones .jsonl de la carpeta (solo metadatos: nombre, tamaño en bytes, fecha de modificación). Solo lectura.",
  inputSchema: {
    type: "object",
    properties: {
      sort_by: { type: "string", enum: ["modified", "size", "name"], description: "Orden (por defecto: modified, más reciente primero)" },
      limit: { type: "integer", minimum: 1, description: "Máximo de filas a devolver; el total siempre se informa" },
    },
  },
  annotations: { readOnlyHint: true },
};

async function listConversations({ sort_by = "modified", limit } = {}) {
  const names = (await readdir(DIR)).filter((n) => n.endsWith(".jsonl"));
  const rows = await Promise.all(names.map(async (name) => {
    const s = await stat(join(DIR, name));
    return { name, size_bytes: s.size, modified: s.mtime.toISOString() };
  }));
  rows.sort((a, b) =>
    sort_by === "size" ? b.size_bytes - a.size_bytes :
    sort_by === "name" ? a.name.localeCompare(b.name) :
    b.modified.localeCompare(a.modified));
  return { total: rows.length, shown: limit ? Math.min(limit, rows.length) : rows.length, files: limit ? rows.slice(0, limit) : rows };
}

const send = (m) => process.stdout.write(JSON.stringify({ jsonrpc: "2.0", ...m }) + "\n");

createInterface({ input: process.stdin }).on("line", async (line) => {
  let msg;
  try { msg = JSON.parse(line); } catch { return; }
  const { id, method, params } = msg;
  if (id === undefined) return; // notificaciones
  try {
    if (method === "initialize") {
      send({ id, result: { protocolVersion: params?.protocolVersion ?? "2025-03-26", capabilities: { tools: {} }, serverInfo: { name: "conversaciones-ro", version: "1.0.0" } } });
    } else if (method === "tools/list") {
      send({ id, result: { tools: [TOOL] } });
    } else if (method === "tools/call" && params?.name === TOOL.name) {
      const out = await listConversations(params.arguments ?? {});
      send({ id, result: { content: [{ type: "text", text: JSON.stringify(out, null, 2) }] } });
    } else if (method === "ping") {
      send({ id, result: {} });
    } else {
      send({ id, error: { code: -32601, message: `No soportado: ${method}` } });
    }
  } catch (e) {
    send({ id, result: { isError: true, content: [{ type: "text", text: String(e.message) }] } });
  }
});
