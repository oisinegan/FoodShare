const express = require("express");
const router = express.Router();
const connection = require("../config/dbConfig");
const bycrpt = require("bcrypt");

router.post("/", (req, res) => {
  connection.connect();
  let info = req.body;

  connection.query(
    "SELECT * FROM User WHERE email = '" + info.email + "'",
    async (err, rows, fields) => {
      if (err) throw err;

      if (rows[0] != undefined) {
        res.send(false);
      } else {
        const hashedPassword = await bycrpt.hash(info.password, 10);

        const sql =
          "INSERT INTO User (`name`, `email`, `pass`) VALUES ('" +
          info.name +
          "', '" +
          info.email +
          "', '" +
          hashedPassword +
          "')";
        connection.query(sql, (err, rows, fields) => {
          if (err) throw err;

          res.send(true);
        });
      }
    }
  );
});

module.exports = router;
