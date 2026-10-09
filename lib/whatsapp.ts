export const WHATSAPP_NUMBER = "524771395384";

// Enlace de WhatsApp con un mensaje ya escrito para cotizar un producto.
export function whatsappQuoteUrl(product: { name: string; sku: string; slug: string }) {
  const text =
    `Hola, quiero cotizar: ${product.name} (SKU ${product.sku}).\n` +
    `https://construccion-ecommerce.vercel.app/producto/${product.slug}`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

// Un producto sin precio (precio 0) no se vende en línea: se cotiza.
export function isQuoteOnly(product: { price: number }) {
  return !(product.price > 0);
}
