const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const { logger } = require('./middleware/logEvents');
const dbRoutes = require('./api/routes/dbRoutes');
const errorHandler = require('./middleware/errorHandler');
const cors = require("cors");

app.use(cors());

/**
 * Swagger and OpenAPI
 */
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

//TODO: Deploy production server with fly
const swaggerDocument = swaggerJsDoc({
  definition: {
    openapi: "3.0.3",
    info: {
      title: "Demo",
      version: "0.1.0",
      description:
        "**REST API** used for accessing the database of climbing areas and climbers of Slovenia.",
    },
    tags: [
      {
        name: "Areas",
        description: "Climbing areas in in Slovenia.",
      },
      {
        name: "Comments",
        description: "<b>Comments</b> for climbing areas locations in Slovenia.",
      },
      {
        name: "Users",
        description: "Users registered in the plezalni vodič.",
      },
      {
        name: "UserClimbs",
        description: "Climbs of users registered in the plezalni vodič",
      },
      {
        name: "Events",
        description: "Group events useerc can apply to",
      },
      {
        name: "Authentication",
        description: "<b>User management</b> and authentication.",
      }
    ],
    servers: [
      {
        url: "http://localhost:3000/api",
        description: "Development server for testing",
      },
      {
        url: "https://plezalni-vodič.fly.dev/api",
        description: "Production server",
      },
    ],
    components: {
      schemas: {
        ErrorMessage: {
          type: "object",
          properties: {
            message: {
              type: "string",
              description: "Message describing the error.",
            },
          },
          required: ["message"],
        },
      },
      securitySchemes: {
        jwt: {
          type: "http",
          scheme: "bearer",
          in: "header",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["./api/models/*.js", "./api/controllers/*.js"],
});
 
const db = require('./api/models/db');
const PORT = process.env.PORT || 3000;

//middleware logger --> to have a log of all CRUD operations 
//in ./logs folder

const apiRouter = require("./api/routes/api");
app.use(logger);

// Middleware to parse JSON and urlencoded data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


/**
 * Static pages
 */
app.use("/ABI", express.static(path.join(__dirname, "dapp", "build", "contracts")));
app.use(express.static(path.join(__dirname, "angular", "build")));

  
/*api routing*/ 
// after moving to angular change from '/' to '/api' to match prof. Lavbič
app.use('/api', require('./api/routes/api')); 
app.use('/api', require('./api/routes/api')); 
/**
 * Swagger file and explorer
 */
app.get("/swagger.json", (req, res) =>
  res.status(200).json(swaggerDocument)
);
app.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, {
    customCss: ".swagger-ui .topbar { display: none }",
  })
);

app.use('/db', dbRoutes);


/**
 * Error Handler
 */
app.use(errorHandler);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "angular", "build", "index.html"));
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "angular", "build", "index.html"));
});

/**
 * Authorization error handler
 */
app.use((err, req, res, next) => {
  if (err.name === "UnauthorizedError")
    res.status(401).json({ message: err.message });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
