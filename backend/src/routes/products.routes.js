const express = require('express');
const router = express.Router();
const productsCtrl = require('../ctrls/products.ctrl');

const validate = require('../middlewares/validate.middleware');
const {
  idParamSchema,
  slugParamSchema,
  createProductSchema,
  updateProductSchema
} = require('../schemas/products.schemas');

// Definición de rutas del módulo products
router.get('/', productsCtrl.getProducts);
router.get('/deleted', productsCtrl.getDeletedProducts);
router.get('/slug/:slug', validate({ params: slugParamSchema }), productsCtrl.getProductBySlug);
router.get('/:id', validate({ params: idParamSchema }), productsCtrl.getProductById);
router.post('/', validate({ body: createProductSchema }), productsCtrl.createProduct);
router.put('/:id', validate({ params: idParamSchema, body: updateProductSchema }), productsCtrl.updateProduct);
router.patch('/:id', validate({ params: idParamSchema, body: updateProductSchema }), productsCtrl.patchProduct);
router.patch('/:id/activate', validate({ params: idParamSchema }), productsCtrl.activateProduct);
router.patch('/:id/deactivate', validate({ params: idParamSchema }), productsCtrl.deactivateProduct);
router.delete('/:id', validate({ params: idParamSchema }), productsCtrl.softDeleteProduct);
router.post('/:id/restore', validate({ params: idParamSchema }), productsCtrl.restoreProduct);

module.exports = router;
