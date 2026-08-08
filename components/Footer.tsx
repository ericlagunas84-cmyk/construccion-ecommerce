import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-brand-ink py-14 text-sm text-white/70">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 md:grid-cols-4">
        <div>
          <p className="mb-3 font-display text-lg font-700 text-white">
            Construc<span className="text-brand-orange">Express</span>
          </p>
          <p className="max-w-[26ch] text-white/60">
            Materiales y herramientas de construcción con entrega rápida en todo el país.
          </p>
        </div>
        <div>
          <p className="mb-3 font-semibold text-white">Comprar</p>
          <ul className="space-y-2">
            <li><Link href="/catalogo" className="hover:text-white">Catálogo</Link></li>
            <li><Link href="/carrito" className="hover:text-white">Carrito</Link></li>
            <li><Link href="/checkout" className="hover:text-white">Checkout</Link></li>
          </ul>
        </div>
        <div>
          <p className="mb-3 font-semibold text-white">Empresa</p>
          <ul className="space-y-2">
            <li><Link href="/quienes-somos" className="hover:text-white">Quiénes somos</Link></li>
            <li><Link href="/contacto" className="hover:text-white">Contacto</Link></li>
            <li><Link href="/terminos" className="hover:text-white">Términos y condiciones</Link></li>
            <li><Link href="/privacidad" className="hover:text-white">Aviso de privacidad</Link></li>
            <li><Link href="/devoluciones" className="hover:text-white">Política de devoluciones</Link></li>
          </ul>
        </div>
        <div>
          <p className="mb-3 font-semibold text-white">Contacto</p>
          <ul className="space-y-2">
            <li>Tel: (55) 0000 0000</li>
            <li>WhatsApp: (55) 0000 0000</li>
            <li>Lun–Sáb 8:00–19:00</li>
          </ul>
        </div>
      </div>
      <div className="mx-auto mt-10 max-w-7xl border-t border-white/10 px-6 pt-6 text-xs text-white/40">
        © {new Date().getFullYear()} ConstruExpress. Todos los derechos reservados.
      </div>
    </footer>
  );
}
