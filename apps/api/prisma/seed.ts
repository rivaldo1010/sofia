import 'dotenv/config';
import { PrismaClient, Gender } from '@prisma/client';

const prisma = new PrismaClient();

const HOMBRE = Gender.HOMBRE;
const MUJER = Gender.MUJER;

async function main() {
  console.log('🌱 Sembrando datos de demostración...');

  // Limpiar datos existentes (orden importa por las foreign keys)
  await prisma.favorite.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.variant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  // ==================== CATEGORÍAS HOMBRE ====================
  const catHombre = await Promise.all([
    prisma.category.create({ data: { name: 'Camisetas', slug: 'camisetas', gender: HOMBRE } }),
    prisma.category.create({ data: { name: 'Gorras', slug: 'gorras', gender: HOMBRE } }),
    prisma.category.create({ data: { name: 'Canguros', slug: 'canguros', gender: HOMBRE } }),
    prisma.category.create({ data: { name: 'Pantalones', slug: 'pantalones', gender: HOMBRE } }),
    prisma.category.create({ data: { name: 'Shorts', slug: 'shorts', gender: HOMBRE } }),
    prisma.category.create({ data: { name: 'Chaquetas', slug: 'chaquetas', gender: HOMBRE } }),
    prisma.category.create({ data: { name: 'Zapatos', slug: 'zapatos', gender: HOMBRE } }),
    prisma.category.create({ data: { name: 'Accesorios', slug: 'accesorios', gender: HOMBRE } }),
  ]);

  // ==================== CATEGORÍAS MUJER ====================
  const catMujer = await Promise.all([
    prisma.category.create({ data: { name: 'Camisetas', slug: 'camisetas', gender: MUJER } }),
    prisma.category.create({ data: { name: 'Tops', slug: 'tops', gender: MUJER } }),
    prisma.category.create({ data: { name: 'Pantalones', slug: 'pantalones', gender: MUJER } }),
    prisma.category.create({ data: { name: 'Jeans', slug: 'jeans', gender: MUJER } }),
    prisma.category.create({ data: { name: 'Vestidos', slug: 'vestidos', gender: MUJER } }),
    prisma.category.create({ data: { name: 'Faldas', slug: 'faldas', gender: MUJER } }),
    prisma.category.create({ data: { name: 'Bolsos', slug: 'bolsos', gender: MUJER } }),
    prisma.category.create({ data: { name: 'Accesorios', slug: 'accesorios', gender: MUJER } }),
    prisma.category.create({ data: { name: 'Zapatos', slug: 'zapatos', gender: MUJER } }),
  ]);

  const findCat = (arr: any[], slug: string) => arr.find((c) => c.slug === slug)!.id;

  // ==================== PRODUCTOS HOMBRE ====================
  const productosHombre: any[] = [
    {
      name: 'Gorra Nike',
      slug: 'gorra-nike',
      description: 'Gorra clásica con logo bordado. Ajuste cómodo y estilo deportivo.',
      price: 24.99,
      comparePrice: null,
      sku: 'HOM-GOR-001',
      brand: 'Nike',
      categoryId: findCat(catHombre, 'gorras'),
      images: [
        'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800',
        'https://images.unsplash.com/photo-1521369909029-2afed882baee?w=800',
      ],
      colors: ['negro', 'blanco'],
      sizes: ['Única'],
      keywords: ['gorra', 'nike', 'negra', 'deportiva', 'cap'],
      stock: 25,
      featured: true,
      isNew: false,
    },
    {
      name: 'Canguro Oversize',
      slug: 'canguro-oversize',
      description: 'Canguro oversize con capucha. Tela suave, ideal para el día a día.',
      price: 34.99,
      comparePrice: 44.99,
      sku: 'HOM-CAN-001',
      brand: 'Sofía',
      categoryId: findCat(catHombre, 'canguros'),
      images: [
        'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800',
        'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800',
      ],
      colors: ['negro', 'gris'],
      sizes: ['S', 'M', 'L', 'XL'],
      keywords: ['canguro', 'hoodie', 'oversize', 'negro', 'sudadera'],
      stock: 18,
      featured: true,
      isNew: false,
    },
    {
      name: 'Camiseta Básica',
      slug: 'camiseta-basica',
      description: 'Camiseta de algodón peinado. Corte regular, suave al tacto.',
      price: 19.99,
      comparePrice: null,
      sku: 'HOM-CAM-001',
      brand: 'Sofía',
      categoryId: findCat(catHombre, 'camisetas'),
      images: [
        'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800',
        'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800',
      ],
      colors: ['negro', 'blanco', 'gris'],
      sizes: ['S', 'M', 'L', 'XL'],
      keywords: ['camiseta', 'basica', 'algodon', 'negro', 'blanco'],
      stock: 40,
      featured: true,
      isNew: true,
    },
    {
      name: 'Pantalón Cargo',
      slug: 'pantalon-cargo',
      description: 'Pantalón cargo con múltiples bolsillos. Estilo urbano y resistente.',
      price: 39.99,
      comparePrice: null,
      sku: 'HOM-PAN-001',
      brand: 'Sofía',
      categoryId: findCat(catHombre, 'pantalones'),
      images: [
        'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800',
        'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=800',
      ],
      colors: ['verde', 'negro'],
      sizes: ['28', '30', '32', '34', '36'],
      keywords: ['pantalon', 'cargo', 'verde', 'urbano', 'bolsillos'],
      stock: 22,
      featured: true,
      isNew: false,
    },
    {
      name: 'Short Deportivo',
      slug: 'short-deportivo',
      description: 'Short deportivo transpirable. Perfecto para entrenar.',
      price: 17.99,
      comparePrice: 24.99,
      sku: 'HOM-SHO-001',
      brand: 'Sofía',
      categoryId: findCat(catHombre, 'shorts'),
      images: [
        'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=800',
        'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800',
      ],
      colors: ['negro'],
      sizes: ['S', 'M', 'L', 'XL'],
      keywords: ['short', 'deportivo', 'negro', 'entrenar', 'gym'],
      stock: 30,
      featured: true,
      isNew: false,
    },
    {
      name: 'Cadena de Acero',
      slug: 'cadena-acero',
      description: 'Cadena de acero inoxidable. Estilo hip-hop, resistente al óxido.',
      price: 18.99,
      comparePrice: null,
      sku: 'HOM-ACC-001',
      brand: 'Sofía',
      categoryId: findCat(catHombre, 'accesorios'),
      images: [
        'https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=800',
        'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800',
      ],
      colors: ['plata', 'dorado'],
      sizes: ['Única'],
      keywords: ['cadena', 'acero', 'collar', 'plata', 'dorado', 'hiphop'],
      stock: 50,
      featured: true,
      isNew: true,
    },
    {
      name: 'Mochila Urbana',
      slug: 'mochila-urbana',
      description: 'Mochila urbana resistente al agua. Compartimento para laptop 15".',
      price: 32.99,
      comparePrice: 44.99,
      sku: 'HOM-ACC-002',
      brand: 'Sofía',
      categoryId: findCat(catHombre, 'accesorios'),
      images: [
        'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800',
        'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=800',
      ],
      colors: ['negro', 'gris'],
      sizes: ['Única'],
      keywords: ['mochila', 'urbana', 'negra', 'laptop', 'resistente'],
      stock: 15,
      featured: true,
      isNew: false,
    },
  ];
for (const p of productosHombre) {
  const created = await prisma.product.create({ data: { ...p, gender: HOMBRE } });
  // Crear variants con stock
  for (const color of p.colors) {
    for (const size of p.sizes) {
      await prisma.variant.create({
        data: {
          productId: created.id,
          color,
          size,
          stock: Math.floor(p.stock / (p.colors.length * p.sizes.length)),
        },
      });
    }
  }
}
  // ==================== PRODUCTOS MUJER ====================
  const productosMujer: any[] = [
    {
      name: 'Top Deportivo',
      slug: 'top-deportivo',
      description: 'Top deportivo de secado rápido. Soporte medio, ideal para gym.',
      price: 22.99,
      comparePrice: null,
      sku: 'MUJ-TOP-001',
      brand: 'Sofía',
      categoryId: findCat(catMujer, 'tops'),
      images: [
        'https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=800',
        'https://images.unsplash.com/photo-1518310383802-640c2de311b6?w=800',
      ],
      colors: ['negro', 'blanco'],
      sizes: ['XS', 'S', 'M', 'L'],
      keywords: ['top', 'deportivo', 'gym', 'negro', 'blanco'],
      stock: 20,
      featured: true,
      isNew: false,
    },
    {
      name: 'Jeans Mom Fit',
      slug: 'jeans-mom-fit',
      description: 'Jeans mom fit tiro alto. Tela rígida con lavado clásico.',
      price: 44.99,
      comparePrice: 59.99,
      sku: 'MUJ-JEA-001',
      brand: 'Sofía',
      categoryId: findCat(catMujer, 'jeans'),
      images: [
        'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800',
        'https://images.unsplash.com/photo-1584370848010-d7fe6bc767ec?w=800',
      ],
      colors: ['azul', 'negro'],
      sizes: ['26', '28', '30', '32'],
      keywords: ['jeans', 'mom', 'fit', 'azul', 'tiro alto'],
      stock: 18,
      featured: true,
      isNew: false,
    },
    {
      name: 'Vestido Floral',
      slug: 'vestido-floral',
      description: 'Vestido largo con estampado floral. Ligero, perfecto para verano.',
      price: 49.99,
      comparePrice: null,
      sku: 'MUJ-VES-001',
      brand: 'Sofía',
      categoryId: findCat(catMujer, 'vestidos'),
      images: [
        'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800',
        'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800',
      ],
      colors: ['floral'],
      sizes: ['XS', 'S', 'M', 'L'],
      keywords: ['vestido', 'floral', 'verano', 'largo', 'estampado'],
      stock: 12,
      featured: true,
      isNew: true,
    },
    {
      name: 'Bolso Cuero',
      slug: 'bolso-cuero',
      description: 'Bolso de cuero sintético premium. Asa ajustable y múltiples bolsillos.',
      price: 39.99,
      comparePrice: 54.99,
      sku: 'MUJ-BOL-001',
      brand: 'Sofía',
      categoryId: findCat(catMujer, 'bolsos'),
      images: [
        'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800',
        'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800',
      ],
      colors: ['negro', 'cafe'],
      sizes: ['Única'],
      keywords: ['bolso', 'cuero', 'negro', 'cafe', 'cartera'],
      stock: 15,
      featured: true,
      isNew: false,
    },
    {
      name: 'Gorra NY Mujer',
      slug: 'gorra-ny-mujer',
      description: 'Gorra con logo NY bordado. Ajuste con hebilla trasera.',
      price: 24.99,
      comparePrice: null,
      sku: 'MUJ-GOR-001',
      brand: 'New Era',
      categoryId: findCat(catMujer, 'accesorios'),
      images: [
        'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800',
        'https://images.unsplash.com/photo-1533055640609-24b498dfd74c?w=800',
      ],
      colors: ['negro', 'rosa'],
      sizes: ['Única'],
      keywords: ['gorra', 'ny', 'negra', 'rosa', 'new era'],
      stock: 22,
      featured: true,
      isNew: false,
    },
    {
      name: 'Camiseta Oversize Mujer',
      slug: 'camiseta-oversize-mujer',
      description: 'Camiseta oversize con corte relajado. Algodón premium.',
      price: 22.99,
      comparePrice: 32.99,
      sku: 'MUJ-CAM-001',
      brand: 'Sofía',
      categoryId: findCat(catMujer, 'camisetas'),
      images: [
        'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800',
        'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800',
      ],
      colors: ['blanco', 'negro', 'rosa'],
      sizes: ['XS', 'S', 'M', 'L'],
      keywords: ['camiseta', 'oversize', 'blanca', 'negra', 'rosa'],
      stock: 25,
      featured: true,
      isNew: true,
    },
    {
      name: 'Pantalón Cargo Mujer',
      slug: 'pantalon-cargo-mujer',
      description: 'Pantalón cargo tiro alto. Estilo utilitario con cinturón.',
      price: 39.99,
      comparePrice: null,
      sku: 'MUJ-PAN-001',
      brand: 'Sofía',
      categoryId: findCat(catMujer, 'pantalones'),
      images: [
        'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800',
        'https://images.unsplash.com/photo-1584370848010-d7fe6bc767ec?w=800',
      ],
      colors: ['verde', 'negro', 'beige'],
      sizes: ['XS', 'S', 'M', 'L'],
      keywords: ['pantalon', 'cargo', 'verde', 'beige', 'cinturon'],
      stock: 20,
      featured: true,
      isNew: false,
    },
  ];

for (const p of productosMujer) {
  const created = await prisma.product.create({ data: { ...p, gender: MUJER } });
  for (const color of p.colors) {
    for (const size of p.sizes) {
      await prisma.variant.create({
        data: {
          productId: created.id,
          color,
          size,
          stock: Math.floor(p.stock / (p.colors.length * p.sizes.length)),
        },
      });
    }
  }
}

  // ==================== CONTEO FINAL ====================
  const totalProducts = await prisma.product.count();
  const totalCategories = await prisma.category.count();
  const totalVariants = await prisma.variant.count();

  console.log('');
  console.log('✅ Seed completado:');
  console.log(`   • ${totalCategories} categorías`);
  console.log(`   • ${totalProducts} productos`);
  console.log(`   • ${totalVariants} variantes`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });