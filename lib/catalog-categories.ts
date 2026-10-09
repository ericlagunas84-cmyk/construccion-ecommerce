// Categorías del catálogo de Epoxy Depot. Es la única fuente de verdad:
// la usan el menú "Productos" del Header y la importación del catálogo,
// así ambos siempre coinciden.
export const CATALOG_CATEGORIES = [
  {
    slug: "maquinaria",
    name: "Maquinaria",
    description: "Desbastadoras, pulidoras, abrillantadoras, restregadoras y aspiradoras industriales.",
  },
  {
    slug: "diamantes-pulido",
    name: "Diamantes, Pulido y Abrillantado",
    description: "Diamantes de desbaste, resinas, felpas y discos para pulir concreto.",
  },
  {
    slug: "herramientas-preparacion",
    name: "Herramientas de Preparación",
    description: "Discos de corte, guardas cubre polvo, raspadores, llanas y accesorios de preparación.",
  },
  {
    slug: "herramientas-aplicacion",
    name: "Herramientas de Aplicación",
    description: "Rodillos, jaladores, flotas, niveladores y pistolas de calafateo.",
  },
  {
    slug: "mezcladoras",
    name: "Batidores y Mezcladoras",
    description: "Mezcladoras eléctricas, aspas y mezcladores para recubrimientos y morteros.",
  },
  {
    slug: "instrumentos-medicion",
    name: "Instrumentos de Medición",
    description: "Medidores de humedad y kits de dureza para diagnosticar el concreto.",
  },
  {
    slug: "materiales",
    name: "Materiales y Químicos",
    description: "Densificadores, abrillantadores, limpiadores y recubrimientos para pisos.",
  },
] as const;
