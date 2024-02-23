const express = require("express");
const router = express.Router();
const connection = require("../config/dbConfig");

router.post("/", (req, res) => {
  connection.connect();
  let info = req.body;
  console.log(info)
        const sql =
          "INSERT INTO Charity (`name`, `long`, `lat`, `website`, `number`) VALUES ('" +
          info.name +
          "', '" +
          info.long +
          "', '" +
          info.lat +
          "', '" +
          info.web +
          "', '" +
          info.phone +
          "')";
        connection.query(sql, (err, rows, fields) => {
          if (err) throw err;

          res.send(true);
        });
      
});

module.exports = router;
