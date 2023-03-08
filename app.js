const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

// Necesarios para el development
const compression = require("compression");
const helmet = require("helmet");

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

const dev_db_url = "mongodb://127.0.0.1:27017/ECS"
  // "mongodb+srv://emusttm:01Tgeqk91B8Vijiy@ecs.siltcam.mongodb.net/ECS?retryWrites=true&w=majority";
//mongodb://127.0.0.1:27017/ECS Para DEV y el otro para Desarrollo
const MONGODB_URI = process.env.MONGODB_URI || dev_db_url; //Reemplaza la url de tu instancia de MongoDB
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });
const db = mongoose.connection;

//Check for successful connection
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", function () {
  console.log("Connection to MongoDB established successfully");
});

// Crear instancia de MongoStore y pasarla como parámetro en app.use(session({...}))

const store = new MongoStore({
  mongoUrl: MONGODB_URI, //mongodb://127.0.0.1:27017/ECS-users
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




// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Middlewares
app.use(compression());
// El helmet genera que tenga problemas con dependencias como fontawesome

app.use(
  helmet({
    // Nos permite usar algunas dependencias en las views, como bootstrap o fontawesome
    contentSecurityPolicy: false,
  })
);



app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, "public")));
app.use('/public', express.static(`${__dirname}/public/images`))


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
