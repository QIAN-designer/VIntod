const { z } = require('zod');

// Schema for MongoDB ObjectId
const objectIdRegex = /^[0-9a-fA-F]{24}$/;

const idParamSchema = z.object({
  id: z.string().regex(objectIdRegex, 'El identificador no tiene un formato válido (debe ser un ObjectId de 24 caracteres)')
});

const slugParamSchema = z.object({
  slug: z.string().min(1, 'El slug es obligatorio')
});

const createProductSchema = z.object({
  title: z.string().min(3, 'El título debe tener al menos 3 caracteres'),
  description: z.string().min(10, 'La descripción debe tener al menos 10 caracteres'),
  price: z.number().positive('El precio debe ser un número positivo'),
  brand: z.string().min(1, 'La marca es obligatoria'),
  size: z.string().min(1, 'La talla es obligatoria'),
  condition: z.string().min(1, 'El estado/condición es obligatorio')
});

// Partial hace que todos los campos sean opcionales para el PUT/PATCH
const updateProductSchema = createProductSchema.partial();

module.exports = {
  idParamSchema,
  slugParamSchema,
  createProductSchema,
  updateProductSchema
};
