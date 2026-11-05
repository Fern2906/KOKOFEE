import { createApp } from './app';
import { env } from './config/env';
import { connectDatabase, disconnectDatabase, seedDatabaseIfEmpty } from './config/database';

async function bootstrap(): Promise<void> {
  await connectDatabase();
  await seedDatabaseIfEmpty();

  const app = createApp();
  const server = app.listen(env.PORT, () => {
    console.log(`[server] KOKOFEE API escuchando en http://localhost:${env.PORT}`);
    console.log(`[server] Entorno: ${env.NODE_ENV}`);
  });

  const shutdown = async (signal: string): Promise<void> => {
    console.log(`\n[server] ${signal} recibido, cerrando...`);
    server.close(async () => {
      await disconnectDatabase();
      process.exit(0);
    });
  };

  process.on('SIGINT', () => void shutdown('SIGINT'));
  process.on('SIGTERM', () => void shutdown('SIGTERM'));
}

bootstrap().catch((error) => {
  console.error('[fatal] No se pudo iniciar la API:', error);
  process.exit(1);
});
