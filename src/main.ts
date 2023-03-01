import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { config, swaggerCustomOptions } from './config/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 3000;

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, swaggerCustomOptions);

  await app.listen(port, () => {
    Logger.log(`Listening at port: ${port}`);
    Logger.log(process.env.NODE_ENV);
    Logger.log(
      `Running in: ${
        process.env.NODE_ENV ? process.env.NODE_ENV : 'production'
      } mode`,
    );
  });
}
bootstrap();
