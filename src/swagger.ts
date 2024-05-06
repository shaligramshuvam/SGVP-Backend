import swaggerJsdoc from 'swagger-jsdoc';
const options = {
  swaggerDefinition: {
    info: {
      title: 'Your API Title',
      version: '1.0.0',
      description: 'API documentation using Swagger',
    },
  },
  apis: ['./controllers/*.ts'], // Path to your controller files
};

const swaggerSpec = swaggerJsdoc(options);
export default swaggerSpec;
