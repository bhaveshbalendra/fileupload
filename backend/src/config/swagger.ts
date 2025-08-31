import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

// Swagger documentation options
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "File Upload Application API",
      version: "1.0.0",
      description: "API documentation for the File Upload Application",
    },
  },
  apis: ["./src/routes/**/*.ts"],
};

// Swagger documentation generation
const swaggerDocs = swaggerJsDoc(swaggerOptions);

// Swagger model validation
require("swagger-model-validator")(swaggerDocs);

// Export Swagger documentation and UI
export { swaggerDocs, swaggerUi };
