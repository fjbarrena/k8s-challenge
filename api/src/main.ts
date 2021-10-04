import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as helmet from 'helmet';
import express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Helmet can help protect an app from some well-known web vulnerabilities by setting HTTP headers appropriately
  app.use(helmet());
  
  // Only allow JSON payloads
  /*app.use(
    express.json({
      type: "application/json"
    })
  );*/

  const config = new DocumentBuilder()
    .setTitle('Kyso Challenge API')
    .setDescription('A REST API server which accepts posts requests to run kyso-dash docker container in the cloud, and to save logs of the container runs in mongodb.')
    .setVersion('1.0')
    .addBearerAuth(
      { in: 'header', type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }
    )
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}

bootstrap();

console.log(`
──────▄▌▐▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀​▀▀▀▀▀▀▌
───▄▄██▌█ BEEP BEEP
▄▄▄▌▐██▌█ Kyso API is coming...
███████▌█▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄​▄▄▄▄▄▄▌
▀(@)▀▀▀▀▀▀▀(@)(@)▀▀▀▀▀▀▀▀▀▀▀▀▀​▀▀▀▀(@)▀
`);
