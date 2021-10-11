import { NestFactory } from "@nestjs/core";

import { DatabaseSeedingModule } from "./database-seeding.module";
import { DatabaseSeedingService } from "./database-seeding.service";

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(DatabaseSeedingModule);
  const databaseSeedingService = app.get(DatabaseSeedingService);

  await databaseSeedingService.seedQuestions();
}
bootstrap();
