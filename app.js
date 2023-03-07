const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

// Necesario para el incio de sesión de los usuarios
const session = require("express-session");
const MongoStore = require("connect-mongo");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const componentsRouter = require("./routes/components");
const pcsRouter = require("./routes/computers");

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const app = express();

// Middlewares
const setActivePage = require("./middlewares/setActivePage");

// Connect to MongoDB
const MONGODB_URI = "mongodb://127.0.0.1:27017/ECS"; //Reemplaza la url de tu instancia de MongoDB
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });
const db = mongoose.connection;

//Check for successful connection
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", function () {
  console.log("Connection to MongoDB established successfully");
});

// Crear instancia de MongoStore y pasarla como parámetro en app.use(session({...}))

const store = new MongoStore({
  mongoUrl: "mongodb://127.0.0.1:27017/ECS-users",
  mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
  collectionName: "sessions",
  ttl: 24 * 60 * 60, // time to live in seconds
});

app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
    store: store,
  })
);

//asdas

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", setActivePage, indexRouter);
app.use("/users", setActivePage, usersRouter);
app.use("/components", setActivePage, componentsRouter);
app.use("/computers", setActivePage, pcsRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
