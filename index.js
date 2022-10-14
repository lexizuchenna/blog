const express = require("express");
const dotenv = require("dotenv").config();
const path = require("path");
const passport = require("passport");
const flash = require("connect-flash");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const { engine } = require("express-handlebars");

const app = express();

// Connect to Data Base
const connectDB = require("./config/db");

// Passport
require("./config/passport")(passport);

// Connect to MongoDB
connectDB();

// Body Parser
app.use(express.urlencoded({ limit: "30mb", extended: false }));

// Handlebars Helpers
//const {} = require("./middlewares/hbsHelper");

// Express-Handlbars Engine
app.engine(
  ".hbs",
  engine({
    defaultLayout: "main",
    extname: "hbs",
    //helpers: {},
  })
);
app.set("view engine", ".hbs");

//Public Folder
app.use(express.static(path.join(__dirname, "public")));

// Express Session
app.use(
  session({
    secret: process.env.SECRET,
    resave: true,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
    }),
    cookie: {
      maxAge: 18000000,
    },
  })
);

// Flash
app.use(flash());

// Passport Initialization
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/", require("./routes/index"));
app.use("/posts", require("./routes/posts"));
app.use("/users", require("./routes/users"));

// Port listening
app.listen(process.env.PORT, () => {
  console.log(`App Started on PORT ${process.env.PORT}`);
});
