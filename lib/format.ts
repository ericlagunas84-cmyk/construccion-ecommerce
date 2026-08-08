export function money(n: number) {
  return n.toLocaleString("es-MX", { style: "currency", currency: "MXN" });
}
