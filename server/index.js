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
const supabase = require('@supabase/supabase-js');
const { createClient } = require('@supabase/supabase-js');
const connectionString = process.env.DATABASE_URL
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: connectionString
})

app.use(
  cors({
    // origin: process.env.URL_ADDRESS,
    origin: [
      "http://192.168.1.8:8081",
      "http://192.168.1.8:19006",
      "http://192.168.1.8:19000",
      "http://localhost:3000",
      "https://localhost:3000",
      "http://10.9.10.25:8081",
      "http://172.20.10.2:8081",
      "http://172.20.10.2:8080",
      "http://172.20.10.2:8000",
    ],
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

console.log(connectionString)


app.use(passport.initialize());
app.use(passport.session());

require("./passportConfig")(passport);

const loginRouter = require("./routes/Login");
app.use("/Login", loginRouter);

const getUserRouter = require("./routes/getUser");
app.use("/getUser", getUserRouter);

const registerRouter = require("./routes/Register");
app.use("/Register", registerRouter);

const postAdRouter = require("./routes/PostAd");
app.use("/PostAd", postAdRouter);

const getAllItemsRouter = require("./routes/getAllItems");
app.use("/getAllItems", getAllItemsRouter);

const searchItemsRouter = require("./routes/searchItems");
app.use("/searchItems", searchItemsRouter);

const retrieveUserAdsRouter = require("./routes/retrieveUserAds");
app.use("/retrieveUserAds", retrieveUserAdsRouter);

const retrieveLikedAdsRouter = require("./routes/retrieveLikedAds");
app.use("/retrieveLikedAds", retrieveLikedAdsRouter);

const registerInterestRouter = require("./routes/registerInterest");
app.use("/registerInterest", registerInterestRouter);

const unregisterInterestRouter = require("./routes/unregisterInterest");
app.use("/unregisterInterest", unregisterInterestRouter);

const getResponsesRouter = require("./routes/getResponses");
app.use("/getResponses", getResponsesRouter);

const updateUserRouter = require("./routes/updateUser");
app.use("/updateUser", updateUserRouter);

const getUserInfoRouter = require("./routes/getUserInfo");
app.use("/getUserInfo", getUserInfoRouter);

const registerCharityRouter = require("./routes/registerCharity");
app.use("/registerCharity", registerCharityRouter);

const getCharityRouter = require("./routes/getCharity");
app.use("/getCharity", getCharityRouter);

const getPendingCharitiesRouter = require("./routes/getPendingCharities");
app.use("/getPendingCharities", getPendingCharitiesRouter);

const completeCharityRouter = require("./routes/completeCharity");
app.use("/completeCharity", completeCharityRouter);

const completeShareRouter = require("./routes/CompleteShare");
app.use("/completeShare", completeShareRouter);

const removeAdRouter = require("./routes/removeAd");
app.use("/removeAd", removeAdRouter);

const addSharePointsRouter = require("./routes/addSharePoints");
app.use("/addSharePoints", addSharePointsRouter);

app.listen(process.env.PORT, () => {
  console.log("Server started on server " + process.env.PORT);
});
