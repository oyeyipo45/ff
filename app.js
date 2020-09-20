const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const exphbs = require("express-handlebars");
const path = require("path");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require('connect-mongo')(session)
const mongoose = require('mongoose')
const methodOverride = require('method-override')


const app = express();


//BODY PARSER
app.use(express.urlencoded({extended: false}))
app.use(express.json())

//METHOD OVERRIDE
app.use
(methodOverride(function (req, res) {
  if(req.body && typeof req.body === 'object' && '_method' in req.body){
    //look in the urlencoded POST bodies and delete it
    let method = req.body._method
    delete req.body._method
    return method
  }
}))


//LOAD CONFIG
dotenv.config({ path: "./config/config.env" });


//PASSPORT CONFIG
require("./config/passport")(passport);


//CONNECTING DB
const connectDB = require("./config/db");
const { Mongoose } = require("mongoose");
connectDB();

//LOGGING MESSAGES
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}


//HANDLEBAARS HELPERS
const {formatDate, stripTags, truncate, editIcon, select} = require('./helpers/hbs')

//HANDLEBARS
app.engine(".hbs", exphbs({helpers: {
  formatDate,
  stripTags, 
  truncate,
  editIcon,
  select
},  
defaultLayout: "main", 
extname: ".hbs" 
})
);
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


//SET GLOBAL VARIABLE
//setting the user to a global variavle to we can access iy when making edits
app.use(function (req, res, next){
  res.locals.user = req.user || null
  next()
})


//STATIC FOLDER
app.use(express.static(path.join(__dirname, "public")));


//ROUTES
app.use("/", require("./routes/index"));
app.use("/auth", require("./routes/auth"));
app.use("/memories", require("./routes/memories"));


const PORT = process.env.PORT || 3010;


app.listen(
  PORT,
  console.log(`server started on ${process.env.NODE_ENV} mode on port ${PORT}`)
);
