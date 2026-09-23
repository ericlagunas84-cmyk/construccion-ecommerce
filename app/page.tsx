import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Categories from "@/components/Categories";
import FeaturedProducts from "@/components/FeaturedProducts";
import Benefits from "@/components/Benefits";
import BrandsCarousel from "@/components/BrandsCarousel";
import { PromoBanner, CTASection } from "@/components/PromoBanner";
import Footer from "@/components/Footer";
import { getBrands } from "@/lib/data/catalog";
import { getActiveBanners } from "@/lib/data/banners";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [brands, heroBanners, promoBanners] = await Promise.all([
    getBrands(),
    getActiveBanners("HERO"),
    getActiveBanners("PROMO"),
  ]);

  return (
    <>
      <Header />
      <main>
        <Hero banner={heroBanners[0] ?? null} />
        <Categories />
        <FeaturedProducts />
        <Benefits />
        <BrandsCarousel brands={brands} />
        <PromoBanner banner={promoBanners[0] ?? null} />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
