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

const mapProduct = product => {
    if (!product) return product;
    const { id, ...rest } = product;
    return { _id: id, ...rest };
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
    });
    return products.map(mapProduct);
};

const findDeleted = async () => {
    const products = await prisma.product.findMany({
        where: { deletedAt: { not: null } },
    });
    return products.map(mapProduct);
};

const findById = async id => {
    const product = await prisma.product.findFirst({
        where: { id, OR: [{ deletedAt: null }, { deletedAt: { isSet: false } }] },
    });
    return mapProduct(product);
};

const findBySlug = async slug => {
    const product = await prisma.product.findFirst({
        where: { slug, OR: [{ deletedAt: null }, { deletedAt: { isSet: false } }] },
    });
    return mapProduct(product);
};

const create = async productData => {
    if (productData.title && !productData.slug) {
        productData.slug = await generateUniqueSlug(productData.title);
    }
    const product = await prisma.product.create({
        data: productData,
    });
    return mapProduct(product);
};

const update = async (id, productData) => {
    if (productData.title) {
        productData.slug = await generateUniqueSlug(productData.title);
    }
    return handleNotFound(
        prisma.product.update({
            where: { id },
            data: productData,
        }),
    );
};

const patch = async (id, productData) => {
    if (productData.title) {
        productData.slug = await generateUniqueSlug(productData.title);
    }
    return handleNotFound(
        prisma.product.update({
            where: { id },
            data: productData,
        }),
    );
};

const softDelete = async id => {
    return handleNotFound(
        prisma.product.update({
            where: { id },
            data: { deletedAt: new Date() },
        }),
    );
};

const restore = async id => {
    const result = await prisma.product.updateMany({
        where: { id, deletedAt: { not: null } },
        data: { deletedAt: null },
    });

    if (result.count === 0) return null;
    const product = await prisma.product.findUnique({ where: { id } });
    return mapProduct(product);
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
