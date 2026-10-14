require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const generateUniqueSlug = async (title, modelDelegate = prisma.product) => {
    if (!title) return undefined;
    const baseSlug = title
        .toLowerCase()
        .trim()
        .replace(/[\s\W-]+/g, "-");

    let slug = baseSlug;
    let isUnique = false;
    let counter = 1;

    while (!isUnique) {
        const existing = await modelDelegate.findUnique({ where: { slug } });
        if (!existing) {
            isUnique = true;
        } else {
            slug = `${baseSlug}-${counter}`;
            counter++;
        }
    }

    return slug;
};

const seedDatabase = async () => {
    try {
        console.log("🔄 Conectando a la base de datos vía Prisma...");
        await prisma.$connect();
        console.log("✅ Conexión establecida.");

        console.log("🗑️  Limpiando colecciones anteriores...");
        await prisma.productImage.deleteMany();
        await prisma.productVariant.deleteMany();
        await prisma.product.deleteMany();
        await prisma.brand.deleteMany();
        await prisma.category.deleteMany();
        await prisma.user.deleteMany();
        await prisma.role.deleteMany();

        console.log("🛡️ Creando roles...");
        const adminRole = await prisma.role.create({
            data: { name: "ADMIN", description: "Administrador general del sistema" },
        });
        const userRole = await prisma.role.create({
            data: { name: "USER", description: "Usuario comprador/vendedor del marketplace" },
        });
        const modRole = await prisma.role.create({
            data: { name: "MODERATOR", description: "Moderador de catálogo" },
        });

        console.log("👤 Creando usuarios...");
        const sellerUser = await prisma.user.create({
            data: {
                username: "carmen_vintage",
                email: "carmen@vintod.com",
                password: "hashedpassword123",
                avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
                bio: "Amante de la moda vintage y prendas únicas de los 90.",
                city: "Madrid",
                country: "España",
                roleId: userRole.id,
            },
        });

        const adminUser = await prisma.user.create({
            data: {
                username: "admin_vintod",
                email: "admin@vintod.com",
                password: "adminpassword123",
                avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
                bio: "Administrador del sistema Vintod",
                city: "Barcelona",
                country: "España",
                roleId: adminRole.id,
            },
        });

        console.log("📁 Creando categorías...");
        const catModaHombre = await prisma.category.create({
            data: { name: "Hombre", slug: "hombre" },
        });
        const catModaMujer = await prisma.category.create({
            data: { name: "Mujer", slug: "mujer" },
        });
        const catCalzado = await prisma.category.create({
            data: { name: "Calzado", slug: "calzado" },
        });
        const catAccesorios = await prisma.category.create({
            data: { name: "Accesorios", slug: "accesorios" },
        });

        console.log("🏷️ Creando marcas...");
        const brandNike = await prisma.brand.create({
            data: { name: "Nike", slug: "nike", logoUrl: "https://logo.clearbit.com/nike.com" },
        });
        const brandLevis = await prisma.brand.create({
            data: { name: "Levi's", slug: "levis", logoUrl: "https://logo.clearbit.com/levi.com" },
        });
        const brandAdidas = await prisma.brand.create({
            data: { name: "Adidas", slug: "adidas", logoUrl: "https://logo.clearbit.com/adidas.com" },
        });
        const brandZara = await prisma.brand.create({
            data: { name: "Zara", slug: "zara", logoUrl: "https://logo.clearbit.com/zara.com" },
        });
        const brandVans = await prisma.brand.create({
            data: { name: "Vans", slug: "vans", logoUrl: "https://logo.clearbit.com/vans.com" },
        });

        console.log("👗 Creando productos con variantes e imágenes...");
        const productsSeedData = [
            {
                title: "Sudadera con capucha vintage",
                description: "Sudadera oversize estilo retro, algodón grueso y muy cómoda.",
                brandId: brandNike.id,
                categoryId: catModaHombre.id,
                sellerId: sellerUser.id,
                variants: [
                    {
                        size: "L",
                        color: "Gris jaspeado",
                        condition: "Muy bueno",
                        price: 24.99,
                        stock: 1,
                        images: [
                            {
                                url: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600",
                                isCover: true,
                                altText: "Sudadera frontal",
                            },
                        ],
                    },
                ],
            },
            {
                title: "Pantalones vaqueros 501",
                description: "Vaqueros clásicos corte recto azul medio, poco uso.",
                brandId: brandLevis.id,
                categoryId: catModaHombre.id,
                sellerId: sellerUser.id,
                variants: [
                    {
                        size: "W32 L30",
                        color: "Azul denim",
                        condition: "Excelente",
                        price: 38.0,
                        stock: 1,
                        images: [
                            {
                                url: "https://images.unsplash.com/photo-1542272604-780c96856592?w=600",
                                isCover: true,
                                altText: "Vaqueros Levi's",
                            },
                        ],
                    },
                ],
            },
            {
                title: "Zapatillas deportivas retro",
                description: "Zapatillas blancas con detalles en ante gris. Sin caja original.",
                brandId: brandAdidas.id,
                categoryId: catCalzado.id,
                sellerId: sellerUser.id,
                variants: [
                    {
                        size: "42",
                        color: "Blanco / Gris",
                        condition: "Bueno",
                        price: 45.5,
                        stock: 1,
                        images: [
                            {
                                url: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=600",
                                isCover: true,
                                altText: "Zapatillas Adidas retro",
                            },
                        ],
                    },
                ],
            },
            {
                title: "Cazadora vaquera borreguillo",
                description: "Chaqueta de abrigo forrada por dentro, perfecta para entretiempo y frío.",
                brandId: brandZara.id,
                categoryId: catModaMujer.id,
                sellerId: sellerUser.id,
                variants: [
                    {
                        size: "M",
                        color: "Azul claro",
                        condition: "Nuevo con etiquetas",
                        price: 55.0,
                        stock: 1,
                        images: [
                            {
                                url: "https://images.unsplash.com/photo-1544441893-675973e31985?w=600",
                                isCover: true,
                                altText: "Cazadora borreguillo Zara",
                            },
                        ],
                    },
                ],
            },
            {
                title: "Camiseta gráfica skate",
                description: "Camiseta de algodón negro con estampado serigrafiado frontal.",
                brandId: brandVans.id,
                categoryId: catModaHombre.id,
                sellerId: sellerUser.id,
                variants: [
                    {
                        size: "S",
                        color: "Negro",
                        condition: "Muy bueno",
                        price: 12.0,
                        stock: 1,
                        images: [
                            {
                                url: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600",
                                isCover: true,
                                altText: "Camiseta Vans frontal",
                            },
                        ],
                    },
                ],
            },
        ];

        let count = 0;
        for (const item of productsSeedData) {
            const slug = await generateUniqueSlug(item.title);
            const { variants, ...prodFields } = item;

            const createdProduct = await prisma.product.create({
                data: {
                    ...prodFields,
                    slug,
                },
            });

            let varIndex = 1;
            for (const v of variants) {
                const { images, ...variantFields } = v;
                const sku = `SKU-${slug.toUpperCase()}-${varIndex++}`;
                const createdVariant = await prisma.productVariant.create({
                    data: {
                        ...variantFields,
                        sku,
                        productId: createdProduct.id,
                    },
                });

                if (images && images.length > 0) {
                    for (const img of images) {
                        await prisma.productImage.create({
                            data: {
                                ...img,
                                variantId: createdVariant.id,
                            },
                        });
                    }
                }
            }
            count++;
        }

        console.log(`✅ ¡Éxito! Se han insertado roles, usuarios, categorías, marcas y ${count} productos con variantes.`);
    } catch (error) {
        console.error("❌ Error al poblar la base de datos:", error.message);
    } finally {
        await prisma.$disconnect();
        console.log("🔌 Conexión cerrada.");
        process.exit(0);
    }
};

seedDatabase();
