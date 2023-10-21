const express = require("express");
const app = express();
const cors = require("cors");
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

const getExampleRouter = require("./routes/exampleRoute");
app.use("/exampleRouter", getExampleRouter);

const getExampleDBconnection = require("./routes/exampleDBconnection");
app.use("/exampleDBconnection", getExampleDBconnection);

app.listen(process.env.PORT, () => {
  console.log("Server started on server " + process.env.PORT);
});
