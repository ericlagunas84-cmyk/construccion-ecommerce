export type Availability = "disponible" | "pocas-piezas" | "agotado";

export type ProductSpecItem = { label: string; value: string };

export type Product = {
  sku: string;
  slug: string;
  name: string;
  category: string;
  categoryName?: string;
  brand: string;
  price: number;
  compareAtPrice?: number;
  availability: Availability;
  featured: boolean;
  shortDescription: string;
  description: string;
  specs: ProductSpecItem[];
  hasTechSheet: boolean;
  soldCount: number;
  createdAt: string;
};

export type Category = {
  slug: string;
  name: string;
  description: string;
  productCount: number;
};

export type Brand = { name: string };

export type Sucursal = { id: string; name: string; address: string; hours: string };
