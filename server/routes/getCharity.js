const express = require("express");
const router = express.Router();
const connection = require("../config/dbConfig");

router.get("/", (req, res) => {
  connection.connect();

  connection.query(
    "SELECT * FROM Charity",

    (err, rows, fields) => {
      if (err) throw err;
      const charity = [{}];
      rows.forEach((row) => {
        const {
          id,
          name,
          long,
          lat,
          website,
          number,
        } = row;
        charity.push({
            id,
            name,
            long,
            lat,
            website,
            number,
        });
      });
      console.log(charity);
      res.send(charity);
    }
  );
});

module.exports = router;
