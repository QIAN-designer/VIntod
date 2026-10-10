const productsRepo = require("../repos/products.repo");
const AppError = require("./utils/appError");

const getAllProducts = async () => {
    const products = await productsRepo.findAll();
    return products;
};

const getDeletedProducts = async () => {
    const products = await productsRepo.findDeleted();
    return products;
};

const getProductById = async id => {
    const product = await productsRepo.findById(id);
    if (!product) {
        throw new AppError("Producto no encontrado", 404);
    }
    return product;
};

const createProduct = async productData => {
    return await productsRepo.create(productData);
};

const updateProduct = async (id, productData) => {
    const product = await productsRepo.update(id, productData);
    if (!product) {
        throw new AppError("Producto no encontrado", 404);
    }
    return product;
};

const patchProduct = async (id, productData) => {
    const product = await productsRepo.patch(id, productData);
    if (!product) {
        throw new AppError("Producto no encontrado", 404);
    }
    return product;
};

const activateProduct = async id => {
    const product = await productsRepo.patch(id, { isActive: true });
    if (!product) {
        throw new AppError("Producto no encontrado", 404);
    }
    return product;
};

const deactivateProduct = async id => {
    const product = await productsRepo.patch(id, { isActive: false });
    if (!product) {
        throw new AppError("Producto no encontrado", 404);
    }
    return product;
};

const softDeleteProduct = async id => {
    const product = await productsRepo.softDelete(id);
    if (!product) {
        throw new AppError("Producto no encontrado", 404);
    }
    return product;
};

const getProductBySlug = async slug => {
    const product = await productsRepo.findBySlug(slug);
    if (!product) {
        throw new AppError("Producto no encontrado", 404);
    }
    return product;
};

const restoreProduct = async id => {
    const product = await productsRepo.restore(id);
    if (!product) {
        throw new AppError("Producto no encontrado o no estaba eliminado", 404);
    }
    return product;
};

module.exports = {
    getAllProducts,
    getDeletedProducts,
    getProductById,
    getProductBySlug,
    createProduct,
    updateProduct,
    patchProduct,
    activateProduct,
    deactivateProduct,
    softDeleteProduct,
    restoreProduct,
};
