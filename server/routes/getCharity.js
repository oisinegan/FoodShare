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
          userId,
        } = row;
        charity.push({
            id,
            name,
            long,
            lat,
            website,
            number,
            userId,
        });
      });
      console.log(charity);
      res.send(charity);
    }
  );
});

module.exports = router;
