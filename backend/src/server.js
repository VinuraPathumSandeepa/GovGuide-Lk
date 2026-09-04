const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./config/db");

const serviceRoutes = require(
  "./modules/serviceDirectory/service.routes"
);

const officeRoutes = require(
  "./modules/officeDirectory/office.routes"
);


// ======================================
// ENVIRONMENT CONFIGURATION
// ======================================

dotenv.config();


// ======================================
// CREATE EXPRESS APPLICATION
// ======================================

const app = express();


// ======================================
// DATABASE CONNECTION
// ======================================

connectDB();


// ======================================
// CORS CONFIGURATION
// ======================================

const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:5173",
  "http://localhost:5174",
].filter(Boolean);


app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.log(
        `Blocked by CORS: ${origin}`
      );

      return callback(
        new Error(
          "This origin is not allowed by CORS."
        )
      );
    },
  })
);


// ======================================
// MIDDLEWARE
// ======================================

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);


// ======================================
// TEST ROUTE
// ======================================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message:
      "GovGuide LK API is running successfully",
  });
});


// ======================================
// HEALTH CHECK
// ======================================

app.get(
  "/api/health",
  (req, res) => {
    res.status(200).json({
      success: true,
      application: "GovGuide LK",
      status: "Healthy",
    });
  }
);


// ======================================
// APPLICATION ROUTES
// ======================================

app.use(
  "/api/services",
  serviceRoutes
);

app.use(
  "/api/offices",
  officeRoutes
);


// ======================================
// 404 HANDLER
// ======================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API endpoint not found.",
  });
});


// ======================================
// GLOBAL ERROR HANDLER
// ======================================

app.use(
  (err, req, res, next) => {
    console.error(
      "Server Error:",
      err.message
    );

    res.status(500).json({
      success: false,
      message:
        "Something went wrong on the server.",
    });
  }
);


// ======================================
// START SERVER
// ======================================

const PORT =
  process.env.PORT || 5000;


app.listen(
  PORT,
  () => {
    console.log(
      "---------------------------------------"
    );

    console.log(
      "GovGuide LK Backend"
    );

    console.log(
      `Server running on port ${PORT}`
    );

    console.log(
      `Local URL: http://localhost:${PORT}`
    );

    console.log(
      "Allowed Frontend Origins:"
    );

    allowedOrigins.forEach(
      (origin) =>
        console.log(`- ${origin}`)
    );

    console.log(
      "---------------------------------------"
    );
  }
);