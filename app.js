const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const exphbs = require("express-handlebars");
const path = require("path");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require('connect-mongo')(session)
const mongoose = require('mongoose')


const app = express();


//LOAD CONFIG
dotenv.config({ path: "./config/config.env" });


//PASSPORT CONFIG
require("./config/passport")(passport);


//CONNECTING DB
const connectDB = require("./config/db");
const { Mongoose } = require("mongoose");
connectDB();


if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}


//HANDLEBARS
app.engine(".hbs", exphbs({ defaultLayout: "main", extname: ".hbs" }));
app.set("view engine", ".hbs");


//SESSION (always before the passport middleware)
app.use(
  session({
    secret: "memories secret",
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({mongooseConnection: mongoose.connection})
  })
);


//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());


//STATIC FOLDER
app.use(express.static(path.join(__dirname, "public")));


//ROUTES
app.use("/", require("./routes/index"));
app.use("/auth", require("./routes/auth"));


const PORT = process.env.PORT || 3010;


app.listen(
  PORT,
  console.log(`server started on ${process.env.NODE_ENV} mode on port ${PORT}`)
);
