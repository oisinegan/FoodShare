const express = require("express");
const router = express.Router();
const connection = require("../config/dbConfig");

router.post("/", (req, res) => {
  connection.connect();
  let info = req.body;

  console.log(info.adId);
  console.log(info.userId);

  const sql =
    "DELETE FROM applicants where adId =" +
    info.adId +
    " AND userInterested = " +
    info.userId +
    ";";

  connection.query(sql, (err, rows, fields) => {
    if (err) throw err;
    res.send(true);
  });
});

module.exports = router;
