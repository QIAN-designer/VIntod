const { prisma } = require("../config/db");

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
        const existing = await prisma.product.findUnique({
            where: { slug },
        });
        if (!existing) {
            isUnique = true;
        } else {
            slug = `${baseSlug}-${counter}`;
            counter++;
        }
    }

    return slug;
};

// Obtiene o crea entidades por defecto para garantizar consistencia si vienen solo como strings
const ensureDefaultEntities = async (data = {}) => {
    // 1. Rol y Usuario vendedor por defecto
    let sellerId = data.sellerId;
    if (!sellerId) {
        let defaultUser = await prisma.user.findFirst();
        if (!defaultUser) {
            let userRole = await prisma.role.findFirst({ where: { name: "USER" } });
            if (!userRole) {
                userRole = await prisma.role.create({
                    data: { name: "USER", description: "Usuario del marketplace" },
                });
            }
            defaultUser = await prisma.user.create({
                data: {
                    username: "vintod_seller",
                    email: "seller@vintod.com",
                    password: "defaultPassword123",
                    city: "Madrid",
                    roleId: userRole.id,
                },
            });
        }
        sellerId = defaultUser.id;
    }

    // 2. Marca por defecto
    let brandId = data.brandId;
    if (!brandId) {
        const brandName = (data.brand || "Vintage").trim();
        const brandSlug = brandName.toLowerCase().replace(/[\s\W-]+/g, "-");
        let brand = await prisma.brand.findUnique({ where: { slug: brandSlug } });
        if (!brand) {
            brand = await prisma.brand.create({
                data: { name: brandName, slug: brandSlug },
            });
        }
        brandId = brand.id;
    }

    // 3. Categoría por defecto
    let categoryId = data.categoryId;
    if (!categoryId) {
        const catName = (data.category || "General").trim();
        const catSlug = catName.toLowerCase().replace(/[\s\W-]+/g, "-");
        let category = await prisma.category.findUnique({ where: { slug: catSlug } });
        if (!category) {
            category = await prisma.category.create({
                data: { name: catName, slug: catSlug },
            });
        }
        categoryId = category.id;
    }

    return { sellerId, brandId, categoryId };
};

// Convierte el formato relacional del nuevo modelo al formato amigable del frontend
const mapProduct = product => {
    if (!product) return product;
    const { id, variants, brand, category, seller, ...rest } = product;

    // Variante principal / primera variante
    const primaryVariant = variants && variants.length > 0 ? variants[0] : null;

    // Imagen principal
    let coverImage = null;
    if (primaryVariant && primaryVariant.images && primaryVariant.images.length > 0) {
        const cover = primaryVariant.images.find(img => img.isCover) || primaryVariant.images[0];
        coverImage = cover ? cover.url : null;
    }

    return {
        _id: id,
        id,
        ...rest,
        // Compatibilidad con frontend catálogo
        price: primaryVariant ? primaryVariant.price : 0,
        size: primaryVariant ? primaryVariant.size : "",
        condition: primaryVariant ? primaryVariant.condition : "",
        color: primaryVariant ? primaryVariant.color : "",
        stock: primaryVariant ? primaryVariant.stock : 1,
        image: coverImage,
        brand: brand ? brand.name : "",
        brandId: product.brandId,
        category: category ? category.name : "",
        categoryId: product.categoryId,
        sellerId: product.sellerId,
        sellerName: seller ? seller.username : "",
        // Relaciones completas embebidas
        variants: variants || [],
        brandInfo: brand || null,
        categoryInfo: category || null,
        sellerInfo: seller || null,
    };
};

const productInclude = {
    brand: true,
    category: true,
    seller: true,
    variants: {
        include: {
            images: true,
        },
    },
};

const handleNotFound = async promise => {
    try {
        const result = await promise;
        return mapProduct(result);
    } catch (error) {
        if (error.code === "P2025") {
            return null;
        }
        throw error;
    }
};

const findAll = async () => {
    const products = await prisma.product.findMany({
        where: { OR: [{ deletedAt: null }, { deletedAt: { isSet: false } }] },
        include: productInclude,
        orderBy: { createdAt: "desc" },
    });
    return products.map(mapProduct);
};

const findDeleted = async () => {
    const products = await prisma.product.findMany({
        where: { deletedAt: { not: null } },
        include: productInclude,
        orderBy: { updatedAt: "desc" },
    });
    return products.map(mapProduct);
};

const findById = async id => {
    const product = await prisma.product.findFirst({
        where: { id, OR: [{ deletedAt: null }, { deletedAt: { isSet: false } }] },
        include: productInclude,
    });
    return mapProduct(product);
};

const findBySlug = async slug => {
    const product = await prisma.product.findFirst({
        where: { slug, OR: [{ deletedAt: null }, { deletedAt: { isSet: false } }] },
        include: productInclude,
    });
    return mapProduct(product);
};

const create = async productData => {
    const {
        title,
        description,
        price,
        size,
        condition,
        color,
        stock = 1,
        image,
        images = [],
        brand,
        category,
        brandId: rawBrandId,
        categoryId: rawCatId,
        sellerId: rawSellerId,
        isActive = true,
        status = "available",
    } = productData;

    const slug = await generateUniqueSlug(title);
    const { sellerId, brandId, categoryId } = await ensureDefaultEntities({
        brand,
        category,
        brandId: rawBrandId,
        categoryId: rawCatId,
        sellerId: rawSellerId,
    });

    // Crear producto base
    const product = await prisma.product.create({
        data: {
            title,
            slug,
            description,
            status,
            isActive,
            sellerId,
            categoryId,
            brandId,
        },
    });

    // Crear variante por defecto
    const sku = `SKU-${slug.toUpperCase()}-1`;
    const variant = await prisma.productVariant.create({
        data: {
            sku,
            size: size || "M",
            color: color || null,
            condition: condition || "Muy bueno",
            price: typeof price === "number" ? price : parseFloat(price) || 0,
            stock: typeof stock === "number" ? stock : parseInt(stock, 10) || 1,
            productId: product.id,
        },
    });

    // Guardar imagen si existe
    const imgUrls = images.length > 0 ? images : image ? [image] : [];
    if (imgUrls.length > 0) {
        for (let i = 0; i < imgUrls.length; i++) {
            await prisma.productImage.create({
                data: {
                    url: imgUrls[i],
                    isCover: i === 0,
                    sortOrder: i,
                    variantId: variant.id,
                },
            });
        }
    }

    return findById(product.id);
};

const update = async (id, productData) => {
    const existing = await prisma.product.findUnique({
        where: { id },
        include: { variants: true },
    });
    if (!existing) return null;

    const {
        title,
        description,
        price,
        size,
        condition,
        color,
        stock,
        brand,
        category,
        brandId,
        categoryId,
        sellerId,
        isActive,
        status,
    } = productData;

    const updateData = {};
    if (title && title !== existing.title) {
        updateData.title = title;
        updateData.slug = await generateUniqueSlug(title);
    }
    if (description !== undefined) updateData.description = description;
    if (isActive !== undefined) updateData.isActive = isActive;
    if (status !== undefined) updateData.status = status;
    if (brandId) updateData.brandId = brandId;
    if (categoryId) updateData.categoryId = categoryId;
    if (sellerId) updateData.sellerId = sellerId;

    if (brand && !brandId) {
        const brandSlug = brand.toLowerCase().replace(/[\s\W-]+/g, "-");
        const b = await prisma.brand.upsert({
            where: { slug: brandSlug },
            update: { name: brand },
            create: { name: brand, slug: brandSlug },
        });
        updateData.brandId = b.id;
    }

    if (category && !categoryId) {
        const catSlug = category.toLowerCase().replace(/[\s\W-]+/g, "-");
        const c = await prisma.category.upsert({
            where: { slug: catSlug },
            update: { name: category },
            create: { name: category, slug: catSlug },
        });
        updateData.categoryId = c.id;
    }

    await prisma.product.update({
        where: { id },
        data: updateData,
    });

    // Si se actualizan precio, talla o condición, actualizar la variante principal
    if (price !== undefined || size !== undefined || condition !== undefined || color !== undefined || stock !== undefined) {
        const primaryVariant = existing.variants[0];
        if (primaryVariant) {
            const variantUpdate = {};
            if (price !== undefined) variantUpdate.price = parseFloat(price);
            if (size !== undefined) variantUpdate.size = size;
            if (condition !== undefined) variantUpdate.condition = condition;
            if (color !== undefined) variantUpdate.color = color;
            if (stock !== undefined) variantUpdate.stock = parseInt(stock, 10);

            await prisma.productVariant.update({
                where: { id: primaryVariant.id },
                data: variantUpdate,
            });
        }
    }

    return findById(id);
};

const patch = async (id, productData) => {
    return update(id, productData);
};

const softDelete = async id => {
    return handleNotFound(
        prisma.product.update({
            where: { id },
            data: { deletedAt: new Date() },
            include: productInclude,
        }),
    );
};

const restore = async id => {
    const result = await prisma.product.updateMany({
        where: { id, deletedAt: { not: null } },
        data: { deletedAt: null },
    });

    if (result.count === 0) return null;
    return findById(id);
};

module.exports = {
    findAll,
    findDeleted,
    findById,
    findBySlug,
    create,
    update,
    patch,
    softDelete,
    restore,
};
