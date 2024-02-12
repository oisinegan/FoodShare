const express = require("express");
const router = express.Router();
const connection = require("../config/dbConfig");

router.post("/", (req, res) => {
  let info = req.body;
  console.log(info);
  connection.connect();
  console.log(info.id);

  connection.query(
    "SELECT * FROM User WHERE id= " + info.user.id + ";",

    (err, rows, fields) => {
      if (err) throw err;
      const info = [];
      rows.forEach((row) => {
        const { Url, points } = row;
        info.push({
          Url,
          points,
        });
      });
      console.log("info");
      console.log(info);
      res.send(info);
    }
  );
});

module.exports = router;
