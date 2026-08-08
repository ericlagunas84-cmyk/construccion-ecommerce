import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CatalogoClient from "@/components/CatalogoClient";
import { getAllProducts, getCategories, getBrands } from "@/lib/data/catalog";

export const dynamic = "force-dynamic";

export default async function CatalogoPage() {
  const [products, categories, brands] = await Promise.all([
    getAllProducts(),
    getCategories(),
    getBrands(),
  ]);

  return (
    <>
      <Header />
      <main className="mx-auto max-w-7xl px-6 py-10">
        <CatalogoClient products={products} categories={categories} brands={brands} />
      </main>
      <Footer />
    </>
  );
}
