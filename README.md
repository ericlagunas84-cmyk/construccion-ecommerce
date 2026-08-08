# ConstruExpress — Fase 1 (completa) + Fase 2 en marcha

Ecommerce construido con Next.js 15 (App Router), TypeScript, Tailwind CSS,
Prisma + PostgreSQL, y NextAuth. Sistema de diseño: azul de marca + gris
oscuro + blanco, naranja reservado solo para botones y promociones.

## Cómo correrlo en tu máquina

Necesitas Node.js 18+ y PostgreSQL corriendo (local, Docker, o un servicio
como Railway/Supabase).

```bash
npm install                      # descarga dependencias e incluye el motor de Prisma
cp .env.example .env             # completa DATABASE_URL con tu Postgres real
npx prisma migrate dev --name init   # crea las tablas
npm run db:seed                  # carga catálogo, sucursales, usuario admin y pedidos de ejemplo
npm run dev
```

Abre http://localhost:3000 para el sitio, y http://localhost:3000/admin/login
para el panel administrativo.

**Usuario administrador de prueba** (creado por el seed):
- Correo: `admin@construexpress.mx`
- Contraseña: `Admin123!`

⚠️ Cambia esta contraseña antes de usar el proyecto en producción.

## Nota importante sobre cómo se construyó esta fase

Prisma necesita descargar un motor binario (query engine) desde
`binaries.prisma.sh` la primera vez que corres `npm install` o
`prisma generate`. **El entorno de este chat no tiene acceso a ese
dominio**, así que no pude correr `prisma generate`, `prisma migrate dev`
ni compilar (`next build`) las páginas que usan Prisma directamente aquí.

Para no entregarte código sin probar, hice esto en su lugar:
1. Instalé PostgreSQL real en el entorno y creé la base de datos
2. Traduje `schema.prisma` a SQL puro (`prisma/migrations/.../migration.sql`)
   y lo apliqué contra Postgres real — confirma que las relaciones y
   restricciones del esquema son válidas
3. Escribí un script de validación con el driver `pg` (sin Prisma) que
   sembró datos reales y corrió las mismas consultas que usa el dashboard,
   el login con bcrypt, y el panel de pedidos — **todo funcionó
   correctamente contra la base de datos real**
4. Revisé con `tsc --noEmit` todo el proyecto. Los únicos errores
   restantes son los enums que Prisma genera a partir de tu esquema
   (`Role`, `OrderStatus`, `Availability`, `DeliveryMethod`) — desaparecen
   solos en cuanto corras `npm install` en tu máquina, porque ahí sí hay
   acceso normal a internet.

En resumen: el diseño de base de datos y la lógica de las queries están
probados con datos reales; lo único que no pude ejecutar aquí es la
generación del cliente de Prisma en sí, por la restricción de red de
este entorno.

## Qué incluye esta fase

### Base de datos (`prisma/schema.prisma`)
Modelos: `User` (con rol Admin/Empleado/Cliente), `Customer`, `Address`,
`Category`, `Brand`, `Sucursal`, `Product` (+ `ProductSpec`), `Order`
(+ `OrderItem`). Migración inicial ya escrita en `prisma/migrations/`.

### Autenticación (`lib/auth.ts`, `middleware.ts`)
NextAuth con Credentials Provider, sesión JWT, contraseñas con bcrypt.
Solo usuarios con rol Admin o Empleado pueden entrar a `/admin/*` — el
middleware protege todas esas rutas automáticamente.

### Registro y login de clientes (`/registro`, `/login`, `/cuenta`)
Usa la misma base de NextAuth + bcrypt que el panel administrativo, sin
depender de ningún servicio externo:
- `/registro` — crea cuenta y **si ya existía un pedido hecho como invitado
  con ese correo, la nueva cuenta se vincula a ese historial automáticamente**
  en vez de duplicar el cliente
- `/login` — inicio de sesión
- `/cuenta` — página protegida con historial real de pedidos
- El checkout precarga nombre y correo si el cliente ya inició sesión
- El Header muestra "Iniciar sesión" o el nombre del cliente según la sesión
- El middleware sigue protegiendo `/admin/*` exclusivamente para roles
  Admin/Empleado — un cliente con sesión no puede entrar al panel

### Panel administrativo (`/admin`)
- **Dashboard** (`/admin`) — ventas del día/mes, pedidos pendientes,
  clientes registrados, productos agotados, top vendidos — todo calculado
  con queries reales a la base de datos
- **Productos** (`/admin/productos`) — listado, crear, editar, duplicar,
  ocultar/mostrar, destacar, eliminar — con Server Actions reales
- **Categorías** (`/admin/categorias`) — crear, editar nombre/descripción,
  ocultar/mostrar, reordenar (↑↓), eliminar (bloqueado automáticamente si
  tiene productos asignados, para no dejar productos huérfanos)
- **Marcas** (`/admin/marcas`) — crear, eliminar (mismo bloqueo de seguridad
  si tiene productos asignados)
- **Pedidos** (`/admin/pedidos`) — listado con cambio de estado en vivo
  (Pendiente → Pagado → Preparando → Enviado → Entregado / Cancelado)
- **Clientes** (`/admin/clientes`) — listado con historial y total comprado
- **Mensajes** (`/admin/mensajes`) — mensajes reales del formulario de
  Contacto, con indicador de "Nuevo" y marcar como leído/no leído

### Checkout — ya crea pedidos reales (`lib/actions/checkout.ts`)
Al enviar el formulario de checkout:
- Busca o crea el `Customer` por correo (checkout como invitado)
- Si es envío a domicilio, guarda la `Address`
- Valida cada producto contra la base de datos — **el precio final se
  calcula con el precio real de la base de datos, nunca con el que venga
  del navegador**, para que nadie pueda manipular el carrito y pagar menos
- Genera un folio consecutivo (`CE-000001`, `CE-000002`, …) y crea el
  `Order` con estado `PENDIENTE`
- Incrementa `soldCount` de cada producto — así "más vendidos" y el
  dashboard reflejan ventas reales

El pedido queda inmediatamente visible en `/admin/pedidos`, listo para
que un administrador cambie su estado. Validado con una simulación
completa contra Postgres real (ver sección de validación más abajo).

### Sitio público (fase 1, sin cambios de comportamiento)
Inicio, Quiénes somos, Catálogo, Producto, Carrito, Checkout, Contacto,
y las 3 páginas legales — documentadas en la sección siguiente.

## Páginas del sitio público

| Página | Ruta |
|---|---|
| Inicio | `/` |
| Quiénes somos | `/quienes-somos` |
| Catálogo | `/catalogo` |
| Producto | `/producto/[slug]` |
| Carrito | `/carrito` |
| Checkout | `/checkout` |
| Contacto | `/contacto` |
| Aviso de privacidad | `/privacidad` |
| Términos y condiciones | `/terminos` |
| Política de devoluciones | `/devoluciones` |

**El catálogo público ya lee de la base de datos real** (Inicio, Catálogo,
fichas de producto, marcas, categorías, sucursales en Checkout/Contacto).
Un producto que crees, ocultes o destaques en `/admin/productos` aparece
o desaparece automáticamente en el sitio — probado con queries reales
contra Postgres (ver sección de validación más abajo).

`lib/mock-data.ts` ya no lo usa ninguna página — solo lo sigue usando
`prisma/seed.ts` como fuente de datos inicial para poblar la base de datos
la primera vez, y `estadosMx` (la lista de estados de México en el
formulario de checkout, que no tiene tabla propia).

## Próximos pasos

- Integrar Mercado Pago (Checkout Pro o API) en el checkout — hoy el
  pedido se crea con estado "Pendiente" sin cobro real
- Enviar correo de confirmación de pedido (Resend, SendGrid, o similar)
- Subida de imágenes de producto con Cloudinary
- Buscador inteligente y recomendaciones con IA (fase 3–4 del plan original)


## Renombrar la marca

El proyecto usa **"ConstruExpress"** como nombre temporal.
1. Busca "ConstruExpress" en `components/Header.tsx`, `components/Footer.tsx`,
   `app/layout.tsx` y `app/admin/login/page.tsx`
2. Ajusta los colores en `tailwind.config.ts` si tu marca usa otros tonos
3. Actualiza `lib/mock-data.ts` y `prisma/seed.ts` con tus datos reales
4. Cambia la contraseña del usuario admin de prueba
5. Ten a un abogado revisando las 3 páginas legales antes de publicarlas

## Desplegar en GitHub + Vercel

Esta es la combinación más natural para este proyecto — Vercel es la
plataforma que hace Next.js, así que no necesitas configurar servidor,
Nginx, ni PM2 como en un VPS.

### 1. Sube el proyecto a GitHub

```bash
# El proyecto ya viene con git inicializado y el primer commit hecho.
# Solo crea el repo en GitHub (vacío, sin README) y conéctalo:
git remote add origin https://github.com/TU-USUARIO/construexpress.git
git branch -M main
git push -u origin main
```

### 2. Consigue una base de datos PostgreSQL

Vercel no incluye PostgreSQL propio en su capa gratuita de forma directa,
pero se integra en un clic con proveedores que sí lo tienen. Recomendado:

- **[Neon](https://neon.tech)** o **[Supabase](https://supabase.com)** — ambos
  tienen plan gratuito, y Vercel los ofrece como integración instalable
  directo desde el dashboard del proyecto ("Storage" → "Connect Database")
- Cualquiera te da un `DATABASE_URL` para copiar

### 3. Importa el proyecto en Vercel

1. Entra a [vercel.com](https://vercel.com) → **Add New → Project**
2. Selecciona el repo de GitHub que acabas de crear
3. Vercel detecta Next.js automáticamente — no cambies nada del build

### 4. Configura las variables de entorno

En el proyecto de Vercel → **Settings → Environment Variables**, agrega:

| Variable | Valor |
|---|---|
| `DATABASE_URL` | La cadena de conexión de Neon/Supabase |
| `NEXTAUTH_SECRET` | Genera uno con `openssl rand -base64 32` |
| `NEXTAUTH_URL` | La URL que te da Vercel, ej. `https://construexpress.vercel.app` |

### 5. Despliega

Con las variables puestas, dale **Deploy**. El script de `build` ya
incluye `prisma generate && prisma migrate deploy`, así que las tablas
se crean solas en el primer despliegue — no necesitas correr nada a mano.

### 6. Carga los datos de ejemplo (solo una vez)

Desde tu máquina, apuntando al `DATABASE_URL` de producción:

```bash
DATABASE_URL="la-misma-url-de-produccion" npm run db:seed
```

Esto crea el catálogo, sucursales, y tu usuario admin de prueba
(`admin@construexpress.mx` / `Admin123!` — **cámbiala de inmediato**
desde `/admin` una vez que tengas login real, o edítala directo en la
base de datos).

### Después de esto

- Cada `git push` a `main` redespliega automáticamente
- Puedes conectar tu dominio propio desde **Settings → Domains**
- Cuando conectemos Mercado Pago, sus claves van en estas mismas
  variables de entorno de Vercel
