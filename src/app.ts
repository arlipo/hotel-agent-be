import express from 'express';
import { logger } from './utils/logger';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './docs/swagger';
import path from 'path';
import { fileURLToPath } from 'url';
import agentRoutes from './routes/agents';
import { initBmEngine } from './services/wink';
import { insertFAQIntoWink } from './services/hotel-faq';
import { initDb } from './database/repository';
import { isErrored } from './utils/probablyUtils';

// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  const dbInitResultPr = await initDb()
  if (isErrored(dbInitResultPr)) {
    logger(`Database initialization failed: ${dbInitResultPr.message}`);
    return;
  }
  initBmEngine()
  insertFAQIntoWink()

  const app = express();

  app.use(express.json());

  app.use(express.static(path.join(__dirname, '..', 'public')));

  // Health check route
  app.get('/health', (req, res) => {
    res.json({ message: 'Server is healthy' })
  });

  // // API routes
  app.use('/api', agentRoutes);

  // // View
  // app.use('/', viewRoutes);

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => {
    logger(`Server is running on http://localhost:${PORT}`);
  });
}

main()