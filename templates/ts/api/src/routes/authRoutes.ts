import { Router } from 'express';
import { AuthController } from '../controllers/authController.js';
import { validate } from '../middleware/validate.js';
import { z } from 'zod';

const router = Router();

// Validation Schemas
const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Debe ser un email válido'),
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  }),
});

router.post('/login', validate(loginSchema), AuthController.login);

export default router;
