const express = require("express");
const router = express.Router();
const connection = require("../config/dbConfig");

router.post("/", (req, res) => {
  let info = req.body;
  console.log(info);
  connection.connect();
  console.log(info.id);
  connection.query(
    "SELECT * FROM ads WHERE userId= " + info.id + ";",

    (err, rows, fields) => {
      if (err) throw err;
      const ads = [{}];
      rows.forEach((row) => {
        const {
          id,
          item,
          image_url,
          brand,
          category,
          userId,
          userName,
          dateTime,
        } = row;
        ads.push({
          id,
          item,
          image_url,
          brand,
          category,
          userId,
          userName,
          dateTime,
        });
      });
      console.log(ads);
      res.send(ads);
    }
  );
});

module.exports = router;
