import { DocumentBuilder, SwaggerCustomOptions } from '@nestjs/swagger';

export const config = new DocumentBuilder()
  .setTitle('API - Prontuário Eletrônico')
  .setDescription('API Prontuário Eletrônico com NestJS')
  .setVersion('1.0')
  .build();

export const swaggerCustomOptions: SwaggerCustomOptions = {
  swaggerOptions: {
    docExpansion: 'none',
    filter: true,
    showRequestDuration: true,
    tagsSorter: 'alpha',
    operationsSorter: 'alpha',
    defaultModelsExpandDepth: 0,
    displayRequestDuration: true,
    displayOperationId: true,
    defaultModelExpandDepth: 0,
    title: 'API - v1', //
  },
};
