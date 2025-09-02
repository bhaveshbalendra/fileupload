import { Router } from 'express';
import {
  createApiKeyController,
  deleteApiKeyController,
  getAllApiKeysController,
} from '../../controllers/apikey.controller';
import { requireAuth } from '../../middlewares/auth.middleware';

const apikeyRoutes = Router();

apikeyRoutes.post('/create', requireAuth, createApiKeyController);
apikeyRoutes.get('/all', requireAuth, getAllApiKeysController);
apikeyRoutes.delete('/:id', requireAuth, deleteApiKeyController);

export default apikeyRoutes;
