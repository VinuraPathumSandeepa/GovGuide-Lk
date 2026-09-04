const express =
  require("express");

const cors =
  require("cors");

const dotenv =
  require("dotenv");


const connectDB =
  require("./config/db");


const serviceRoutes =
  require(
    "./modules/serviceDirectory/service.routes"
  );


const officeRoutes =
  require(
    "./modules/officeDirectory/office.routes"
  );


const inquiryRoutes =
  require(
    "./modules/inquiryManagement/inquiry.routes"
  );


const finderRoutes =
  require(
    "./modules/smartFinder/finder.routes"
  );


// ======================================
// ENVIRONMENT CONFIGURATION
// ======================================

dotenv.config();


// ======================================
// CREATE EXPRESS APPLICATION
// ======================================

const app =
  express();


// ======================================
// DATABASE CONNECTION
// ======================================

connectDB();


// ======================================
// CORS CONFIGURATION
// ======================================

const allowedOrigins = [
  process.env.CLIENT_URL,
].filter(Boolean);


app.use(
  cors({
    origin: function (
      origin,
      callback
    ) {

      // Allow tools such as Postman
      // and direct server requests.

      if (!origin) {
        return callback(
          null,
          true
        );
      }


      // Allow configured deployed
      // frontend.

      if (
        allowedOrigins.includes(
          origin
        )
      ) {
        return callback(
          null,
          true
        );
      }


      // Allow any localhost Vite port
      // during hackathon development.

      const isLocalhost =
        /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(
          origin
        );


      if (isLocalhost) {
        return callback(
          null,
          true
        );
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

app.use(
  express.json()
);


app.use(
  express.urlencoded({
    extended: true,
  })
);


// ======================================
// ROOT ROUTE
// ======================================

app.get(
  "/",
  (req, res) => {

    res.status(200).json({
      success: true,

      application:
        "GovGuide LK",

      message:
        "GovGuide LK API is running successfully",
    });
  }
);


// ======================================
// HEALTH CHECK
// ======================================

app.get(
  "/api/health",
  (req, res) => {

    res.status(200).json({
      success: true,

      application:
        "GovGuide LK",

      status:
        "Healthy",
    });
  }
);


// ======================================
// MEMBER 1 - SERVICE DIRECTORY
// ======================================

app.use(
  "/api/services",
  serviceRoutes
);


// ======================================
// MEMBER 2 - OFFICE DIRECTORY
// ======================================

app.use(
  "/api/offices",
  officeRoutes
);


// ======================================
// MEMBER 3 - INQUIRIES
// ======================================

app.use(
  "/api/inquiries",
  inquiryRoutes
);


// ======================================
// MEMBER 4 - SMART FINDER
// ======================================

app.use(
  "/api/finder",
  finderRoutes
);


// ======================================
// 404 HANDLER
// ======================================

app.use(
  (req, res) => {

    res.status(404).json({
      success: false,

      message:
        "API endpoint not found.",
    });
  }
);


// ======================================
// GLOBAL ERROR HANDLER
// ======================================

app.use(
  (
    err,
    req,
    res,
    next
  ) => {

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
  process.env.PORT ||
  5000;


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
      "Modules:"
    );

    console.log(
      "- Service Directory"
    );

    console.log(
      "- Office Directory"
    );

    console.log(
      "- Inquiry Management"
    );

    console.log(
      "- Smart Service Finder"
    );

    console.log(
      "---------------------------------------"
    );

  }
);