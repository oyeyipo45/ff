const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db")
const morgan = require('morgan')
const exphbs = require("express")


const app = express();

//LOAD CONFIG
dotenv.config({ path: "./config/config.env" });


//CONNECTING DB
connectDB()

process.env.NODE_ENV === 'development' ? app.use(morgan('dev')) : ''



//HANDLEBARS
app.engine('.hbs', exphbs({ defaultLayout: 'main' ,xtname: '.hbs'}));
app.set('view engine', '.hbs');


const PORT = process.env.PORT || 3010;

app.listen(
  PORT,
  console.log(`server started on ${process.env.NODE_ENV} mode on port ${PORT}`)
);
