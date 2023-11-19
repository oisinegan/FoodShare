const express = require("express");
const router = express.Router();
const connection = require("../config/dbConfig");
const bycrpt = require("bcrypt");

router.post("/", (req, res) => {
  connection.connect();
  let info = req.body;

  const sql =
    "INSERT INTO ads (`item`, `image_url`, `brand`, `category`, `userId`, `dateTime`) VALUES ('" +
    info.item +
    "', '" +
    info.image_url +
    "', '" +
    info.Routerbrand +
    "', '" +
    info.category +
    "', '" +
    info.userId +
    "', '" +
    info.dateTime +
    "')";

  connection.query(sql, (err, rows, fields) => {
    if (err) throw err;
    res.send(true);
  });
});

module.exports = router;
