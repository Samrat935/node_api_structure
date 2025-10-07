// src/swagger.ts
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';
import dotenv from 'dotenv'


dotenv.config();

const PORT = process.env.PORT || 5000
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'IMI API Gateway & Management',
      version: '1.0.0',
      description: 'IMI Service API Documentation',
    },    
    servers: [
      {
        url: `http://localhost:${PORT}/`,
      },
    ],
    components: {
      securitySchemes: {
        authorization: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        authorization: [],
      },
    ],
  },
  apis: ['./src/routes/*.ts', './src/schemas/components.yaml'], // Path to the API docs
};

const swaggerSpec = swaggerJsdoc(options);

export const setupSwagger = (app: Express) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
