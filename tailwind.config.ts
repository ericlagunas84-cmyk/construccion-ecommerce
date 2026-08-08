import type { Config } from "tailwindcss";

// ── Sistema de diseño ────────────────────────────────────────────────
// Color:  azul marca (industrial, confianza) + gris oscuro (texto/UI)
//         + blanco (espacio) + naranja SOLO para acción/promoción.
// Tipografía: "Space Grotesk" para títulos (geométrica, carácter propio,
//         no generica), "Inter" para cuerpo (máxima legibilidad),
//         "IBM Plex Mono" para SKU/precios/datos técnicos.
// Firma visual: franja diagonal tipo "cinta de medir / señalización de
//         obra", usada con moderación como divisor entre secciones.
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: "#123A6B",     // azul profundo — marca / headers / links
          "blue-light": "#EAF0F8", // fondo azul muy claro para bloques
          ink: "#20242B",      // gris oscuro — texto principal
          "ink-soft": "#5B6270", // gris medio — texto secundario
          orange: "#E85D25",   // naranja — SOLO botones y promociones
          "orange-dark": "#C24A18",
          line: "#E3E6EA",     // bordes / divisores
          paper: "#FFFFFF",
        },
      },
      fontFamily: {
        // Fuentes del sistema en vez de Google Fonts: se ven modernas y
        // limpias igual, y el build no depende de descargar nada de
        // internet (evita fallos de red durante el deploy en Vercel).
        display: [
          "Poppins", "Segoe UI", "Roboto", "-apple-system", "BlinkMacSystemFont", "sans-serif",
        ],
        body: [
          "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", "sans-serif",
        ],
        mono: [
          "ui-monospace", "SFMono-Regular", "Menlo", "Consolas", "Liberation Mono", "monospace",
        ],
      },
    },
  },
  plugins: [],
};

export default config;
