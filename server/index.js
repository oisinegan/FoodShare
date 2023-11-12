const express = require("express");
const app = express();
const cors = require("cors");
const passport = require("passport");
const passportLocal = require("passport-local").Strategy;
const session = require("express-session");
require("dotenv").config();
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  cors({
    origin: process.env.URL_ADDRESS,
    credentials: true,
  })
);

app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: true,
    saveUninitialized: true,
    cookie: {
      path: "/",
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

require("./passportConfig")(passport);

const getExampleRouter = require("./routes/exampleRoute");
app.use("/exampleRouter", getExampleRouter);

const getExampleDBconnection = require("./routes/exampleDBconnection");
app.use("/exampleDBconnection", getExampleDBconnection);

const loginRouter = require("./routes/Login");
app.use("/Login", loginRouter);

const getUserRouter = require("./routes/getUser");
app.use("/getUser", getUserRouter);

const registerRouter = require("./routes/Register");
app.use("/Register", registerRouter);

app.listen(process.env.PORT, () => {
  console.log("Server started on server " + process.env.PORT);
});
