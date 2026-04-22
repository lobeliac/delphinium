import {
  OpenAPIRegistry,
  OpenApiGeneratorV3,
  extendZodWithOpenApi
} from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
import swaggerUi from "swagger-ui-express";
import type { Express } from "express";

// Extend Zod with OpenAPI methods
extendZodWithOpenApi(z);

export const registry = new OpenAPIRegistry();

// Security scheme definition (e.g. Bearer token)
const bearerAuth = registry.registerComponent("securitySchemes", "bearerAuth", {
  type: "http",
  scheme: "bearer",
  bearerFormat: "JWT"
});

export function setupSwagger(app: Express): void {
  const generator = new OpenApiGeneratorV3(registry.definitions);
  const document = generator.generateDocument({
    openapi: "3.0.0",
    info: {
      title: "Delphinium API",
      version: "1.0.0",
      description: "API documentation for the Delphinium Backend"
    },
    servers: [{ url: "http://localhost:3000" }]
  });

  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(document));
}
