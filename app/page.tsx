import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Categories from "@/components/Categories";
import FeaturedProducts from "@/components/FeaturedProducts";
import Benefits from "@/components/Benefits";
import BrandsCarousel from "@/components/BrandsCarousel";
import { PromoBanner, CTASection } from "@/components/PromoBanner";
import Footer from "@/components/Footer";
import { getBrands } from "@/lib/data/catalog";

export default async function HomePage() {
  const brands = await getBrands();

  return (
    <>
      <Header />
      <main>
        <Hero />
        <Categories />
        <FeaturedProducts />
        <Benefits />
        <BrandsCarousel brands={brands} />
        <PromoBanner />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
