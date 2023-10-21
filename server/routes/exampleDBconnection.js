const express = require("express");
const router = express.Router();
const connection = require("../config/dbConfig");

router.get("/", (req, res) => {
  connection.connect();

  connection.query(
    "SELECT * FROM example",

    (err, rows, fields) => {
      if (err) throw err;
      const results = {};
      rows.forEach((row) => {
        const { id, text } = row;
        //If doesn't exist create row
        if (!results[id]) {
          results[id] = {
            id,
            text,
          };
        }
      });

      res.send(results);
    }
  );
});

module.exports = router;
