import { Router } from 'express';
import { getUserAnalyticsWithChartController } from '../../controllers/analytics.controller';
import { requireAuth } from '../../middlewares/auth.middleware';

const analyticsRoutes = Router();

analyticsRoutes.get('/user', requireAuth, getUserAnalyticsWithChartController);

export default analyticsRoutes;
