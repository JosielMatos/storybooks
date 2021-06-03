const express = require("express");
const app = express();
const morgan = require("morgan");
const exphbs = require("express-handlebars");
const methodOverride = require('method-override');
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const mongoose = require("mongoose");

//config
dotenv.config({ path: "./config/config.env" });
require("./config/passport")(passport);
connectDB();

//dev env requests logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

const { formatDate, truncate, stripTags, editIcon, select } = require("./helpers/hbs");

//Body parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//Method Override
app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    let method = req.body._method
    delete req.body._method
    return method
  }
}));

//Handlebars
app.engine(
  ".hbs",
  exphbs({
    helpers: {
      formatDate,
      stripTags,
      truncate,
      editIcon,
      select
    },
    defaultLayout: "main",
    extname: ".hbs",
  })
);
app.set("view engine", ".hbs");

app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  })
);

//Passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.locals.user = req.user || null
  next()
})

//static folder
app.use(express.static("public"));

//get routes
app.use("/", require("./routes/index"));
app.use("/auth", require("./routes/auth"));
app.use("/stories", require("./routes/stories"));

const PORT = process.env.PORT || 3000;

app.listen(
  PORT,
  console.log(`Server running on ${process.env.NODE_ENV} mode on ${PORT}`)
);
