// Prueba los hooks del plugin a mano: les pasa eventos falsos y compara el código de salida con el esperado.
// Funciona igual en Bash, PowerShell, macOS, Linux y Windows: node plugin/scripts/probar-hooks.js
// No ejecuta nada peligroso: los comandos de los eventos son texto, nadie los corre.
const { spawnSync } = require("child_process");
const fs = require("fs");
const os = require("os");
const path = require("path");

const dir = __dirname;

// Un proyecto de mentira, con git y un cambio, pero sin script "test": el hook de pruebas no debe exigir nada.
const sinPruebas = fs.mkdtempSync(path.join(os.tmpdir(), "sin-pruebas-"));
spawnSync("git", ["init", "-q"], { cwd: sinPruebas });
fs.writeFileSync(path.join(sinPruebas, "package.json"), JSON.stringify({ name: "sin-pruebas", scripts: {} }));
fs.writeFileSync(path.join(sinPruebas, "index.js"), "console.log('hola');\n");

const casos = [
  // [hook, descripción, evento, código esperado]
  ["bloquear-peligroso.js", "Bash: git reset --hard después de &&", { tool_name: "Bash", tool_input: { command: "git status && git reset --hard HEAD" } }, 2],
  ["bloquear-peligroso.js", "PowerShell: git reset --hard después de ;", { tool_name: "PowerShell", tool_input: { command: "git status --short; git reset --hard HEAD" } }, 2],
  ["bloquear-peligroso.js", "Bash: git push --force", { tool_name: "Bash", tool_input: { command: "git push --force origin main" } }, 2],
  ["bloquear-peligroso.js", "Bash: git push con +rama", { tool_name: "Bash", tool_input: { command: "git push origin +main" } }, 2],
  ["bloquear-peligroso.js", "PowerShell: git clean -fd", { tool_name: "PowerShell", tool_input: { command: "git clean -fd" } }, 2],
  ["bloquear-peligroso.js", "Bash: git checkout -- .", { tool_name: "Bash", tool_input: { command: "git checkout -- ." } }, 2],
  ["bloquear-peligroso.js", "PowerShell: git restore .", { tool_name: "PowerShell", tool_input: { command: "git restore ." } }, 2],
  ["bloquear-peligroso.js", "Bash: rm -rf", { tool_name: "Bash", tool_input: { command: "rm -rf .next" } }, 2],
  ["bloquear-peligroso.js", "Bash: rm -r -f", { tool_name: "Bash", tool_input: { command: "rm -r -f .next" } }, 2],
  ["bloquear-peligroso.js", "Bash: rm --recursive --force", { tool_name: "Bash", tool_input: { command: "rm --recursive --force .next" } }, 2],
  ["bloquear-peligroso.js", "PowerShell: Remove-Item -Recurse -Force", { tool_name: "PowerShell", tool_input: { command: "Remove-Item -Recurse -Force .next" } }, 2],
  ["bloquear-peligroso.js", "PowerShell: rd /s /q", { tool_name: "PowerShell", tool_input: { command: "cmd /c rd /s /q .next" } }, 2],
  ["bloquear-peligroso.js", "Evento que no es JSON", "esto no es json", 2],
  ["bloquear-peligroso.js", "Bash: git status pasa", { tool_name: "Bash", tool_input: { command: "git status --short" } }, 0],
  ["bloquear-peligroso.js", "PowerShell: git status pasa", { tool_name: "PowerShell", tool_input: { command: "git status --short" } }, 0],
  ["bloquear-peligroso.js", "Bash: git restore --staged pasa", { tool_name: "Bash", tool_input: { command: "git restore --staged src/app/page.tsx" } }, 0],
  ["bloquear-peligroso.js", "Bash: rm de un archivo pasa", { tool_name: "Bash", tool_input: { command: "rm -f notas.txt" } }, 0],
  ["bloquear-peligroso.js", "PowerShell: Remove-Item -Force de un archivo pasa", { tool_name: "PowerShell", tool_input: { command: "Remove-Item -Force notas.txt" } }, 0],
  ["bloquear-peligroso.js", "Tech Lead: Read de docs/ (ruta de Windows)", { tool_name: "Read", agent_type: "tech-lead", tool_input: { file_path: "C:\\proyecto\\docs\\MEDICIONES.md" } }, 2],
  ["bloquear-peligroso.js", "Tech Lead: Grep con path docs", { tool_name: "Grep", agent_type: "tech-lead", tool_input: { pattern: "Fase", path: "docs" } }, 2],
  ["bloquear-peligroso.js", "Tech Lead: Read de package.json pasa", { tool_name: "Read", agent_type: "tech-lead", tool_input: { file_path: "/proyecto/package.json" } }, 0],
  ["bloquear-peligroso.js", "Conversación principal: Read de docs/ pasa", { tool_name: "Read", tool_input: { file_path: "docs/MEDICIONES.md" } }, 0],
  // Lo que cambia al viajar: el Tech Lead del plugin lleva el prefijo del plugin.
  ["bloquear-peligroso.js", "Plugin: <plugin>:tech-lead, Read de docs/", { tool_name: "Read", agent_type: "red-de-seguridad:tech-lead", tool_input: { file_path: "/proyecto/docs/REVISION.md" } }, 2],
  ["bloquear-peligroso.js", "Plugin: <plugin>:tech-lead, Read de package.json pasa", { tool_name: "Read", agent_type: "red-de-seguridad:tech-lead", tool_input: { file_path: "/proyecto/package.json" } }, 0],
  ["bloquear-peligroso.js", "Otro agente con nombre parecido, Read de docs/ pasa", { tool_name: "Read", agent_type: "mi-tech-lead-2", tool_input: { file_path: "/proyecto/docs/REVISION.md" } }, 0],
  ["exigir-pruebas.js", "Stop en la segunda vuelta pasa", { stop_hook_active: true }, 0],
  ["exigir-pruebas.js", "Stop en un proyecto con cambios y sin script test pasa", { stop_hook_active: false, cwd: sinPruebas }, 0],
];

// Sin CLAUDE_PROJECT_DIR: así el hook de pruebas usa el cwd del evento, y no la carpeta donde corre esta prueba.
const env = { ...process.env };
delete env.CLAUDE_PROJECT_DIR;

let fallas = 0;
let corridas = 0;
for (const [hook, desc, evento, esperado] of casos) {
  const archivo = path.join(dir, hook);
  if (!fs.existsSync(archivo)) continue;
  const entrada = typeof evento === "string" ? evento : JSON.stringify(evento);
  const r = spawnSync(process.execPath, [archivo], { input: entrada, encoding: "utf8", env });
  const ok = r.status === esperado;
  corridas++;
  if (!ok) fallas++;
  console.log(`${ok ? "OK   " : "FALLA"}  exit=${r.status} (esperado ${esperado})  ${hook} · ${desc}`);
}
fs.rmSync(sinPruebas, { recursive: true, force: true });
console.log(`\n${corridas - fallas} de ${corridas} casos dan lo esperado.`);
process.exit(fallas ? 1 : 0);
