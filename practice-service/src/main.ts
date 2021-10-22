import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";

import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.NATS,
      options: {
        servers: ["nats://nats:4222"],
        queue: "practice_queue",
      },
    }
  );
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  await app.listen();
}
bootstrap();
