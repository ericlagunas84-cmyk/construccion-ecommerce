import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function LegalPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="mb-2 text-3xl font-700 text-brand-ink">{title}</h1>
        <p className="mb-10 text-xs text-brand-ink-soft">Última actualización: {updated}</p>
        <div className="space-y-6 text-sm leading-relaxed text-brand-ink-soft [&_h2]:mb-2 [&_h2]:mt-8 [&_h2]:font-display [&_h2]:text-base [&_h2]:font-600 [&_h2]:text-brand-ink [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5">
          {children}
        </div>
      </main>
      <Footer />
    </>
  );
}
