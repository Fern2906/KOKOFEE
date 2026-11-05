import { createApp } from './app';
import { env } from './config/env';
import { connectDatabase, disconnectDatabase, seedDatabaseIfEmpty } from './config/database';

async function bootstrap(): Promise<void> {
  await connectDatabase();
  await seedDatabaseIfEmpty();

  const app = createApp();
  const server = app.listen(env.PORT, () => {
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
  process.exit(1);
});
