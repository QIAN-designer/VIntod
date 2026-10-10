require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const generateUniqueSlug = async title => {
    if (!title) return undefined;
    const baseSlug = title
        .toLowerCase()
        .trim()
        .replace(/[\s\W-]+/g, "-");

    let slug = baseSlug;
    let isUnique = false;
    let counter = 1;

    while (!isUnique) {
        const existing = await prisma.product.findUnique({ where: { slug } });
        if (!existing) {
            isUnique = true;
        } else {
            slug = `${baseSlug}-${counter}`;
            counter++;
        }
    }

    return slug;
};

const sampleProducts = [
    {
        title: "Sudadera con capucha vintage",
        description: "Sudadera oversize estilo retro, algodón grueso y muy cómoda.",
        price: 24.99,
        brand: "Nike",
        size: "L",
        condition: "Muy bueno",
    },
    {
        title: "Pantalones vaqueros 501",
        description: "Vaqueros clásicos corte recto azul medio, poco uso.",
        price: 38.0,
        brand: "Levi's",
        size: "W32 L30",
        condition: "Excelente",
    },
    {
        title: "Zapatillas deportivas retro",
        description: "Zapatillas blancas con detalles en ante gris. Sin caja original.",
        price: 45.5,
        brand: "Adidas",
        size: "42",
        condition: "Bueno",
    },
    {
        title: "Cazadora vaquera borreguillo",
        description: "Chaqueta de abrigo forrada por dentro, perfecta para entretiempo y frío.",
        price: 55.0,
        brand: "Zara",
        size: "M",
        condition: "Nuevo con etiquetas",
    },
    {
        title: "Camiseta gráfica skate",
        description: "Camiseta de algodón negro con estampado serigrafiado frontal.",
        price: 12.0,
        brand: "Vans",
        size: "S",
        condition: "Muy bueno",
    },
];

const seedDatabase = async () => {
    try {
        console.log("🔄 Conectando a la base de datos vía Prisma...");
        await prisma.$connect();
        console.log("✅ Conexión establecida.");

        console.log("🗑️  Limpiando colección de productos...");
        await prisma.product.deleteMany();

        console.log("📦 Insertando productos de prueba...");

        // Add slug to each product before creating them
        let count = 0;
        for (const product of sampleProducts) {
            const slug = await generateUniqueSlug(product.title);
            await prisma.product.create({
                data: { ...product, slug },
            });
            count++;
        }

        console.log(`✅ ¡Éxito! Se han insertado ${count} productos.`);
    } catch (error) {
        console.error("❌ Error al poblar la base de datos:", error.message);
    } finally {
        await prisma.$disconnect();
        console.log("🔌 Conexión cerrada.");
        process.exit(0);
    }
};

seedDatabase();
