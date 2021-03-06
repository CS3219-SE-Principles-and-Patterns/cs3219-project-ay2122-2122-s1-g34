import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { Transport } from "@nestjs/microservices";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import * as helmet from "helmet";

import { RedisIoAdapter } from "./adapters/redis-io.adapter";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableVersioning();
  app.setGlobalPrefix("api");
  app.use(helmet());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useWebSocketAdapter(new RedisIoAdapter(app));

  // setup swagger
  const config = new DocumentBuilder()
    .setTitle("PeerPrep")
    .setVersion("1.0")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api/swagger", app, document);

  app.connectMicroservice({
    transport: Transport.NATS,
    options: {
      servers: [process.env.NATS_SERVER],
      queue: process.env.API_GATEWAY_NATS_QUEUE,
    },
  });
  await app.startAllMicroservices();

  await app.listen(process.env.PORT || 5000);

  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
