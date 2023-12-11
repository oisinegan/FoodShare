const express = require("express");
const router = express.Router();
const connection = require("../config/dbConfig");

router.post("/", (req, res) => {
  connection.connect();
  let info = req.body;
  const sql =
    "INSERT INTO applicants(adId, author, userInterested,userName) VALUES ('" +
    info.adId +
    "','" +
    info.author +
    "','" +
    info.userInterested +
    "','" +
    info.userName +
    "');";

  connection.query(sql, (err, rows, fields) => {
    if (err) throw err;
    res.send(true);
  });
  console.log(info);
  console.log(info.adId);
  console.log(info.author);
});

module.exports = router;
