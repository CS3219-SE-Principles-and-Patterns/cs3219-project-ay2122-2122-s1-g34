import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { Transport } from "@nestjs/microservices";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableVersioning();
  app.setGlobalPrefix("api");
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  // setup swagger
  const config = new DocumentBuilder()
    .setTitle("PeerPrep")
    .setVersion("1.0")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("swagger", app, document);

  app.connectMicroservice({
    transport: Transport.NATS,
    options: {
      servers: ["nats://nats:4222"],
      queue: "api_gateway_queue",
    },
  });
  await app.startAllMicroservices();

  await app.listen(process.env.PORT || 5000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
