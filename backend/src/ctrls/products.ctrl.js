const productsService = require('../services/products.service');

// Capa de controlador: recibe req, llama al servicio y devuelve res
const getProducts = async (req, res, next) => {
  try {
    const products = await productsService.getAllProducts();
    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    next(error);
  }
};

const getDeletedProducts = async (req, res, next) => {
  try {
    const products = await productsService.getDeletedProducts();
    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    next(error);
  }
};

const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await productsService.getProductById(id);
    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
};

const createProduct = async (req, res, next) => {
  try {
    const product = await productsService.createProduct(req.body);
    res.status(201).json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await productsService.updateProduct(id, req.body);
    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
};

const patchProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await productsService.patchProduct(id, req.body);
    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
};

const activateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await productsService.activateProduct(id);
    res.status(200).json({
      success: true,
      message: 'Producto activado correctamente',
      data: product
    });
  } catch (error) {
    next(error);
  }
};

const deactivateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await productsService.deactivateProduct(id);
    res.status(200).json({
      success: true,
      message: 'Producto desactivado correctamente',
      data: product
    });
  } catch (error) {
    next(error);
  }
};

const softDeleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    await productsService.softDeleteProduct(id);
    res.status(200).json({
      success: true,
      message: 'Producto eliminado lógicamente (soft delete) de forma correcta'
    });
  } catch (error) {
    next(error);
  }
};

const getProductBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const product = await productsService.getProductBySlug(slug);
    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
};

const restoreProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await productsService.restoreProduct(id);
    res.status(200).json({
      success: true,
      message: 'Producto restaurado correctamente',
      data: product
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getDeletedProducts,
  getProductById,
  getProductBySlug,
  createProduct,
  updateProduct,
  patchProduct,
  activateProduct,
  deactivateProduct,
  softDeleteProduct,
  restoreProduct
};
