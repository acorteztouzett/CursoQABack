const express = require("express");
const { urlencoded } = require("body-parser");
const passport = require("passport");
const cors = require("cors");
const { createRouteHandler } = require("uploadthing/express");

// const session = require("./src/config/session");
const { run } = require("./src/config/db");
const { logger, requestLogger } = require("./src/utils/logger");
require("dotenv").config();
const session = require("express-session");
const MongoStore = require("connect-mongo");
const connection = require('./src/config/db');
require("dotenv").config();
// Database, passport Setup
run();
require("./src/config/passport");

// TODO: Combine into one ?
const companyRouter = require("./src/routes/company.routes");
const contactRouter = require("./src/routes/contact.routes");
const dealRouter = require("./src/routes/deal.routes");
const leadRouter = require("./src/routes/lead.routes");
const taskRouter = require("./src/routes/task.routes");
const userRouter = require("./src/routes/user.routes");

// RBAC, auth middleware. (naw, fshl)
const { authenticator, permission } = require("./src/middlewares/authenticator");
const authRouter = require("./src/routes/auth.routes");
const uploadRouter = require("./src/middlewares/uploadthing");

const app = express();
const port = process.env.PORT || 3000; // Use port from environment or default to 3000

const mongoStore = new MongoStore({
  mongoUrl: process.env.MONGODB_URI,
  mongooseConnection: connection,
  collectionName: 'sessions',
});

//app.options("*", cors());

app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:5173"], // Aquí especifica los orígenes permitidos.
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "x-uploadthing-version", "Access-Control-Allow-Origin"],
    optionsSuccessStatus: 204,
  })
);

app.use(express.json()); // Parse JSON body data
app.use(urlencoded({ extended: true })); //  Parses urlencoded bodies.
app.use(requestLogger); // A logger for just about everything.

// Sessions Setup
app.use(session({
  name: "snaz_0ozQd8310",
  secret: process.env.SECRET_KEY,
  resave: false,
  saveUninitialized: false,
  unset: "destroy",
  store: mongoStore,
}));
app.use(passport.initialize());
app.use(passport.session());

// API Routers
// TODO: Combine into one ?
app.use("/api/companies", companyRouter);
app.use("/api/contacts", contactRouter);
app.use("/api/deals", dealRouter);
app.use("/api/leads", leadRouter);
app.use("/api/tasks", taskRouter);
app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);
app.use(
  "/api/uploadthing",
  passport.authenticate("session"),
  createRouteHandler({
    router: uploadRouter,
    config: {},
  }),
);

app.listen(port, () => {
  logger.log("info", `Server listening on port ${port}`);
});
