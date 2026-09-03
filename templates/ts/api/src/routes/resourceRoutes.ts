import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { getResources, createResource, updateResource, softDeleteResource, restoreResource } from '../controllers/resourceController.js';

const router = Router();

router.use(authMiddleware);

router.get('/', getResources);
router.post('/', createResource);
router.put('/:id', updateResource);
router.delete('/:id', softDeleteResource);
router.patch('/:id/restore', restoreResource);

export default router;