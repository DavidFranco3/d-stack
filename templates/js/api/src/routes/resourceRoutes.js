import { Router } from 'express';
import { getResources, createResource, updateResource, softDeleteResource, restoreResource } from '../controllers/resourceController.js';

const router = Router();

router.get('/', getResources);
router.post('/', createResource);
router.put('/:id', updateResource);
router.delete('/:id', softDeleteResource);
router.patch('/:id/restore', restoreResource);

export default router;
