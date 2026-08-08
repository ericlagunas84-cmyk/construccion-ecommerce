import LegalPage from "@/components/LegalPage";

export default function PrivacidadPage() {
  return (
    <LegalPage title="Aviso de privacidad" updated="Febrero 2026">
      <p>
        ConstruExpress ("nosotros"), con domicilio para efectos de este aviso en Av. Juárez 120,
        Centro, es responsable del tratamiento de tus datos personales conforme a la Ley Federal
        de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP).
      </p>

      <h2>Datos que recabamos</h2>
      <p>Para procesar tu compra y darte seguimiento, recabamos:</p>
      <ul>
        <li>Datos de identificación: nombre, apellidos</li>
        <li>Datos de contacto: correo electrónico, teléfono, dirección de envío</li>
        <li>Datos de facturación cuando aplique</li>
        <li>Historial de pedidos y preferencias de compra</li>
      </ul>
      <p>No recabamos ni almacenamos datos de tarjetas de pago — esa información la procesa
      directamente Mercado Pago bajo sus propios estándares de seguridad (PCI-DSS).</p>

      <h2>Finalidades</h2>
      <p>Tus datos se usan para:</p>
      <ul>
        <li>Procesar y dar seguimiento a tus pedidos</li>
        <li>Contactarte sobre el estado de tu compra</li>
        <li>Brindarte atención a cliente y soporte técnico sobre productos</li>
        <li>Enviarte promociones, solo si diste tu consentimiento expreso</li>
      </ul>

      <h2>Transferencia de datos</h2>
      <p>
        Compartimos los datos estrictamente necesarios con paqueterías (para la entrega) y con
        Mercado Pago (para el procesamiento del pago). No vendemos ni rentamos tus datos a
        terceros con fines de mercadotecnia ajenos a ConstruExpress.
      </p>

      <h2>Derechos ARCO</h2>
      <p>
        Puedes solicitar en cualquier momento el Acceso, Rectificación, Cancelación u Oposición
        (derechos ARCO) al tratamiento de tus datos, escribiendo a privacidad@construexpress.mx
        con copia de identificación oficial. Responderemos en un plazo máximo de 20 días
        hábiles conforme a la ley.
      </p>

      <h2>Cambios a este aviso</h2>
      <p>
        Podemos actualizar este aviso de privacidad. Los cambios relevantes se publicarán en
        esta misma página con su fecha de actualización.
      </p>
    </LegalPage>
  );
}
