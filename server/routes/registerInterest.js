const express = require("express");
const router = express.Router();
const connection = require("../config/dbConfig");

router.post("/", (req, res) => {
  connection.connect();
  let info = req.body;
  // const sql =
  //   "INSERT INTO applicants(adId, author, userInterested,userName) VALUES ('" +
  //   info.adId +
  //   "','" +
  //   info.author +
  //   "','" +
  //   info.userInterested +
  //   "','" +
  //   info.userName +
  //   "');";

  // connection.query(sql, (err, rows, fields) => {
  //   if (err) throw err;
  //   res.send(true);
  // });
  //SELECT * FROM applicants WHERE adId = 1 AND author = 2 AND userInterested = 1;
  connection.query(
    "SELECT * FROM applicants WHERE adId = " +
      info.adId +
      " AND author = " +
      info.author +
      " AND userInterested = " +
      info.userInterested +
      ";",
    async (err, rows, fields) => {
      if (err) throw err;

      if (rows[0] != undefined) {
        res.send(true);
        console.log("EXISTS");
      } else {
        const sql =
          "INSERT INTO applicants(adId, author, userInterested) VALUES ('" +
          info.adId +
          "','" +
          info.author +
          "','" +
          info.userInterested +
          "');";

        connection.query(sql, (err, rows, fields) => {
          if (err) throw err;
          res.send(true);
        });
      }
    }
  );
  console.log(info);
  console.log(info.adId);
  console.log(info.author);
});

module.exports = router;
