import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "File Upload Application API",
      version: "1.0.0",
      description: "API documentation for the File Upload Application",
    },
  },
  apis: ["./src/routes/*.ts"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

require("swagger-model-validator")(swaggerDocs);

export { swaggerDocs, swaggerUi };
