const express = require("express");
const router = express.Router();
const connection = require("../config/dbConfig");

router.post("/", (req, res) => {
  let info = req.body;
  console.log(info);
  connection.connect();
  console.log(info.AdId);

  connection.query(
    "DELETE FROM applicants WHERE id= " + info.AdId + ";",
    (err, rows, fields) => {
      if (err) throw err; 
      connection.query(
        "DELETE FROM ads WHERE id= " + info.AdId + ";",
        (err, rows, fields) => {
          if (err) throw err; 
          res.send(true);
        }
      );
    }
  );
});

module.exports = router;
