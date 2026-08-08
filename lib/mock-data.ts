// Datos de ejemplo para desarrollo. En producción esto vendrá de
// PostgreSQL vía Prisma (ver /prisma/schema.prisma cuando se conecte
// el backend en la fase 2).

export type Category = {
  slug: string;
  name: string;
  description: string;
  productCount: number;
};

export type Availability = "disponible" | "pocas-piezas" | "agotado";

export type Product = {
  sku: string;
  slug: string;
  name: string;
  category: string;
  brand: string;
  price: number;
  compareAtPrice?: number;
  availability: Availability;
  featured: boolean;
  shortDescription: string;
  description: string;
  specs: { label: string; value: string }[];
  hasTechSheet: boolean;
  soldCount: number; // usado para ordenar "más vendidos"
  createdAt: string; // ISO — usado para ordenar "más recientes"
};

export type Brand = { name: string };

export const categories: Category[] = [
  {
    slug: "polvos",
    name: "Polvos para construcción",
    description: "Cementos, morteros, boquillas y selladores en polvo.",
    productCount: 6,
  },
  {
    slug: "herramientas",
    name: "Herramientas",
    description: "Manuales y eléctricas, para obra y acabado fino.",
    productCount: 6,
  },
  {
    slug: "epoxicos",
    name: "Epóxicos",
    description: "Resinas y recubrimientos epóxicos de alto tránsito.",
    productCount: 4,
  },
  {
    slug: "impermeabilizantes",
    name: "Impermeabilizantes",
    description: "Membranas y recubrimientos para techo y cimentación.",
    productCount: 4,
  },
];

export const brands: Brand[] = [
  { name: "Cemex" },
  { name: "Comex" },
  { name: "Truper" },
  { name: "Bosch" },
  { name: "Fester" },
  { name: "Sika" },
  { name: "DeWalt" },
  { name: "Pochteca" },
];

export type Sucursal = { id: string; name: string; address: string; hours: string };

export const sucursales: Sucursal[] = [
  { id: "centro", name: "Sucursal Centro", address: "Av. Juárez 120, Centro", hours: "Lun–Sáb 8:00–19:00" },
  { id: "norte", name: "Sucursal Norte", address: "Blvd. Industrial 845, Zona Norte", hours: "Lun–Sáb 8:00–18:00" },
  { id: "sur", name: "Sucursal Sur", address: "Calz. del Valle 33, Zona Sur", hours: "Lun–Vie 8:00–18:00" },
];

export const estadosMx = [
  "Ciudad de México", "Jalisco", "Nuevo León", "Chihuahua", "Puebla",
  "Guanajuato", "Querétaro", "Estado de México", "Baja California", "Otro",
];

export const products: Product[] = [
  {
    sku: "CEM-4050",
    slug: "cemento-gris-50kg",
    name: "Cemento gris uso general 50 kg",
    category: "polvos",
    brand: "Cemex",
    price: 245,
    availability: "disponible",
    featured: true,
    shortDescription: "Cemento Portland compuesto para uso general en obra.",
    description:
      "Cemento gris de uso general, ideal para elaboración de concreto, mortero y aplanados. Cumple con la norma NMX-C-414-ONNCCE.",
    specs: [
      { label: "Presentación", value: "Saco 50 kg" },
      { label: "Tipo", value: "CPC 30R" },
      { label: "Rendimiento aprox.", value: "0.033 m³ de concreto por saco" },
      { label: "Norma", value: "NMX-C-414-ONNCCE" },
    ],
    hasTechSheet: true,
    soldCount: 980,
    createdAt: "2025-11-02",
  },
  {
    sku: "MRT-4110",
    slug: "mortero-impermeable-25kg",
    name: "Mortero impermeable prefabricado 25 kg",
    category: "polvos",
    brand: "Fester",
    price: 310,
    availability: "disponible",
    featured: false,
    shortDescription: "Mortero listo para aplanados con impermeabilidad integrada.",
    description:
      "Mezcla lista para usar, solo se agrega agua. Ideal para muros expuestos a humedad y aplanados de fachada.",
    specs: [
      { label: "Presentación", value: "Bolsa 25 kg" },
      { label: "Rendimiento", value: "~5 m² a 1 cm de espesor" },
      { label: "Tiempo de trabajo", value: "45 min" },
    ],
    hasTechSheet: true,
    soldCount: 410,
    createdAt: "2025-10-14",
  },
  {
    sku: "BOQ-4220",
    slug: "boquilla-antimoho-5kg",
    name: "Boquilla antimoho para azulejo 5 kg",
    category: "polvos",
    brand: "Fester",
    price: 195,
    availability: "pocas-piezas",
    featured: false,
    shortDescription: "Boquilla flexible con protección antimoho para juntas de azulejo.",
    description:
      "Formulada para juntas de 1 a 12 mm, con aditivo antimoho para baños y cocinas.",
    specs: [
      { label: "Presentación", value: "Cubeta 5 kg" },
      { label: "Ancho de junta", value: "1–12 mm" },
      { label: "Color", value: "Blanco" },
    ],
    hasTechSheet: false,
    soldCount: 260,
    createdAt: "2026-01-08",
  },
  {
    sku: "YES-4330",
    slug: "yeso-construccion-20kg",
    name: "Yeso para construcción 20 kg",
    category: "polvos",
    brand: "Cemex",
    price: 88,
    availability: "disponible",
    featured: false,
    shortDescription: "Yeso de construcción para acabados interiores.",
    description: "Yeso de fraguado normal para aplanados y detalles decorativos en interiores.",
    specs: [
      { label: "Presentación", value: "Saco 20 kg" },
      { label: "Tiempo de fraguado", value: "20–30 min" },
    ],
    hasTechSheet: false,
    soldCount: 190,
    createdAt: "2025-09-20",
  },
  {
    sku: "SEL-4440",
    slug: "sellador-poros-25kg",
    name: "Sellador de poros en polvo 25 kg",
    category: "polvos",
    brand: "Comex",
    price: 275,
    availability: "disponible",
    featured: false,
    shortDescription: "Sellador base cemento para tapar poros antes de pintar.",
    description: "Prepara superficies de block y tabique para recibir pintura, reduce absorción.",
    specs: [{ label: "Presentación", value: "Saco 25 kg" }, { label: "Rendimiento", value: "~40 m²" }],
    hasTechSheet: true,
    soldCount: 150,
    createdAt: "2025-08-11",
  },
  {
    sku: "AUT-4550",
    slug: "autonivelante-piso-25kg",
    name: "Piso autonivelante 25 kg",
    category: "polvos",
    brand: "Sika",
    price: 420,
    compareAtPrice: 470,
    availability: "disponible",
    featured: false,
    shortDescription: "Mortero autonivelante para preparar pisos antes de piso flotante o vinil.",
    description: "Nivela superficies de concreto con espesores de 2 a 10 mm, listo en 24 horas.",
    specs: [{ label: "Presentación", value: "Saco 25 kg" }, { label: "Espesor", value: "2–10 mm" }],
    hasTechSheet: true,
    soldCount: 320,
    createdAt: "2026-02-01",
  },

  {
    sku: "TAL-1120",
    slug: "taladro-percusion-750w",
    name: "Taladro percusión 750W",
    category: "herramientas",
    brand: "Bosch",
    price: 1189,
    compareAtPrice: 1450,
    availability: "disponible",
    featured: true,
    shortDescription: "Taladro con percusión para concreto, metal y madera.",
    description:
      "Motor de 750W con mandril de 13 mm y selector de velocidad variable. Incluye mango auxiliar y tope de profundidad.",
    specs: [
      { label: "Potencia", value: "750 W" },
      { label: "Mandril", value: "13 mm" },
      { label: "Velocidad", value: "0–3,000 rpm" },
      { label: "Peso", value: "2.1 kg" },
    ],
    hasTechSheet: true,
    soldCount: 540,
    createdAt: "2025-12-05",
  },
  {
    sku: "AMO-1230",
    slug: "amoladora-angular-4-1-2",
    name: "Amoladora angular 4-1/2\"",
    category: "herramientas",
    brand: "DeWalt",
    price: 899,
    availability: "disponible",
    featured: false,
    shortDescription: "Esmeriladora angular para corte y desbaste.",
    description: "Motor de 850W, ideal para corte de metal, desbaste de soldadura y preparación de superficies.",
    specs: [{ label: "Potencia", value: "850 W" }, { label: "Disco", value: "4-1/2\" (115 mm)" }],
    hasTechSheet: true,
    soldCount: 380,
    createdAt: "2025-11-22",
  },
  {
    sku: "NIV-1340",
    slug: "nivel-laser-autonivelante",
    name: "Nivel láser autonivelante",
    category: "herramientas",
    brand: "Truper",
    price: 1250,
    availability: "pocas-piezas",
    featured: false,
    shortDescription: "Nivel láser de líneas cruzadas para trazo rápido.",
    description: "Proyecta líneas horizontal y vertical, autonivelante ±4°, alcance de 15 m.",
    specs: [{ label: "Alcance", value: "15 m" }, { label: "Autonivelación", value: "±4°" }],
    hasTechSheet: false,
    soldCount: 145,
    createdAt: "2026-01-19",
  },
  {
    sku: "MAR-1450",
    slug: "martillo-carpintero-16oz",
    name: "Martillo de carpintero 16 oz",
    category: "herramientas",
    brand: "Truper",
    price: 165,
    availability: "disponible",
    featured: false,
    shortDescription: "Martillo con mango de fibra de vidrio antivibración.",
    description: "Cabeza forjada, mango ergonómico con absorción de impacto.",
    specs: [{ label: "Peso cabeza", value: "16 oz" }, { label: "Mango", value: "Fibra de vidrio" }],
    hasTechSheet: false,
    soldCount: 610,
    createdAt: "2025-07-30",
  },
  {
    sku: "SIE-1560",
    slug: "sierra-circular-7-1-4",
    name: "Sierra circular 7-1/4\"",
    category: "herramientas",
    brand: "DeWalt",
    price: 1780,
    availability: "disponible",
    featured: false,
    shortDescription: "Sierra circular para corte de madera y tablaroca.",
    description: "Motor de 1,600W, ajuste de profundidad e inclinación hasta 56°.",
    specs: [{ label: "Potencia", value: "1,600 W" }, { label: "Disco", value: "7-1/4\" (184 mm)" }],
    hasTechSheet: true,
    soldCount: 210,
    createdAt: "2025-10-02",
  },
  {
    sku: "JGO-1670",
    slug: "juego-llaves-combinadas-12pz",
    name: "Juego de llaves combinadas 12 piezas",
    category: "herramientas",
    brand: "Truper",
    price: 520,
    availability: "disponible",
    featured: false,
    shortDescription: "Juego de llaves de 8 a 19 mm en estuche.",
    description: "Acero cromo-vanadio, acabado pulido, estuche organizador incluido.",
    specs: [{ label: "Piezas", value: "12" }, { label: "Material", value: "Cromo-vanadio" }],
    hasTechSheet: false,
    soldCount: 275,
    createdAt: "2025-09-15",
  },

  {
    sku: "EPX-3301",
    slug: "epoxico-piso-alto-transito",
    name: "Epóxico para piso alto tránsito 19 L",
    category: "epoxicos",
    brand: "Sika",
    price: 2380,
    availability: "pocas-piezas",
    featured: true,
    shortDescription: "Recubrimiento epóxico autonivelante de alta resistencia.",
    description:
      "Sistema epóxico de dos componentes para pisos industriales y comerciales de alto tránsito. Resistente a químicos y abrasión.",
    specs: [
      { label: "Presentación", value: "Kit 19 L" },
      { label: "Rendimiento", value: "~9.5 m² a 2 mm" },
      { label: "Secado al tacto", value: "8 horas" },
    ],
    hasTechSheet: true,
    soldCount: 95,
    createdAt: "2026-01-25",
  },
  {
    sku: "EPX-3402",
    slug: "epoxico-transparente-4l",
    name: "Epóxico transparente decorativo 4 L",
    category: "epoxicos",
    brand: "Sika",
    price: 890,
    availability: "disponible",
    featured: false,
    shortDescription: "Epóxico transparente para acabados decorativos y sellado.",
    description: "Ideal para sellar mesas, pisos decorativos y superficies expuestas a la vista.",
    specs: [{ label: "Presentación", value: "Kit 4 L" }, { label: "Acabado", value: "Brillante" }],
    hasTechSheet: true,
    soldCount: 130,
    createdAt: "2025-12-19",
  },
  {
    sku: "EPX-3503",
    slug: "primer-epoxico-concreto-4l",
    name: "Primer epóxico para concreto 4 L",
    category: "epoxicos",
    brand: "Sika",
    price: 650,
    availability: "disponible",
    featured: false,
    shortDescription: "Imprimante epóxico para preparar concreto antes del recubrimiento final.",
    description: "Mejora la adherencia de recubrimientos epóxicos sobre concreto nuevo o pulido.",
    specs: [{ label: "Presentación", value: "Kit 4 L" }, { label: "Rendimiento", value: "~16 m²" }],
    hasTechSheet: true,
    soldCount: 88,
    createdAt: "2025-11-30",
  },
  {
    sku: "EPX-3604",
    slug: "epoxico-antiderrapante-19l",
    name: "Epóxico antiderrapante para rampas 19 L",
    category: "epoxicos",
    brand: "Sika",
    price: 2590,
    availability: "disponible",
    featured: false,
    shortDescription: "Epóxico con carga de cuarzo para superficies antiderrapantes.",
    description: "Formulado para rampas, andenes y áreas exteriores con riesgo de resbalón.",
    specs: [{ label: "Presentación", value: "Kit 19 L" }, { label: "Textura", value: "Antiderrapante" }],
    hasTechSheet: true,
    soldCount: 54,
    createdAt: "2026-02-10",
  },

  {
    sku: "IMP-2210",
    slug: "impermeabilizante-acrilico-19l",
    name: "Impermeabilizante acrílico 5 años 19 L",
    category: "impermeabilizantes",
    brand: "Comex",
    price: 1560,
    compareAtPrice: 1790,
    availability: "disponible",
    featured: true,
    shortDescription: "Membrana acrílica elastomérica con garantía de 5 años.",
    description:
      "Impermeabilizante 100% acrílico, elástico, resistente a rayos UV. Ideal para azoteas transitables y no transitables.",
    specs: [
      { label: "Presentación", value: "Cubeta 19 L" },
      { label: "Garantía", value: "5 años" },
      { label: "Rendimiento", value: "~9.5 m² a 2 manos" },
    ],
    hasTechSheet: true,
    soldCount: 720,
    createdAt: "2026-01-12",
  },
  {
    sku: "IMP-2311",
    slug: "impermeabilizante-poliuretano-19l",
    name: "Impermeabilizante de poliuretano 19 L",
    category: "impermeabilizantes",
    brand: "Fester",
    price: 3200,
    availability: "disponible",
    featured: false,
    shortDescription: "Membrana líquida de poliuretano de alta elasticidad.",
    description: "Recomendado para cubiertas con encharcamiento y detalles constructivos complejos.",
    specs: [{ label: "Presentación", value: "Cubeta 19 L" }, { label: "Elasticidad", value: "400%" }],
    hasTechSheet: true,
    soldCount: 60,
    createdAt: "2025-10-27",
  },
  {
    sku: "IMP-2412",
    slug: "membrana-asfaltica-10m",
    name: "Membrana asfáltica autoadherible 10 m",
    category: "impermeabilizantes",
    brand: "Fester",
    price: 980,
    availability: "pocas-piezas",
    featured: false,
    shortDescription: "Rollo de membrana asfáltica para cimentación y muros de contención.",
    description: "Autoadherible, no requiere soplete. Barrera contra humedad ascendente.",
    specs: [{ label: "Presentación", value: "Rollo 1 × 10 m" }, { label: "Espesor", value: "1.5 mm" }],
    hasTechSheet: false,
    soldCount: 40,
    createdAt: "2025-09-05",
  },
  {
    sku: "IMP-2513",
    slug: "sellador-juntas-poliuretano-300ml",
    name: "Sellador de juntas poliuretano 300 ml",
    category: "impermeabilizantes",
    brand: "Sika",
    price: 195,
    availability: "disponible",
    featured: false,
    shortDescription: "Sellador flexible para juntas de dilatación y grietas.",
    description: "Cartucho listo para pistola, cura por humedad, pintable.",
    specs: [{ label: "Presentación", value: "Cartucho 300 ml" }, { label: "Color", value: "Gris" }],
    hasTechSheet: false,
    soldCount: 310,
    createdAt: "2025-08-22",
  },
];

export const featuredProducts = products.filter((p) => p.featured);

export function getProductBySlug(slug: string) {
  return products.find((p) => p.slug === slug);
}

export function getRelatedProducts(product: Product, count = 4) {
  return products
    .filter((p) => p.category === product.category && p.slug !== product.slug)
    .slice(0, count);
}
