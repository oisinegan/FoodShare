const express = require("express");
const router = express.Router();
const connection = require("../config/dbConfig");

router.post("/", (req, res) => {
  connection.connect();
  let info = req.body;
  console.log(info);

  connection.query(
    "SELECT * FROM ads WHERE userId != " + info.id + ";",

    (err, rows, fields) => {
      if (err) throw err;
      const ads = [{}];
      rows.forEach((row) => {
        const {
          id,
          item,
          image_url,
          brand,
          userId,
          expiryDate,
          size,
          measurementType,
          quant,
          extraInfo,
          datePosted,
          timePosted,
          postTo,
          long,
          lat,
        } = row;
        ads.push({
          id,
          item,
          image_url,
          brand,
          userId,
          expiryDate,
          size,
          measurementType,
          quant,
          extraInfo,
          datePosted,
          timePosted,
          postTo,
          long,
          lat,
        });
      });
      console.log(ads);
      res.send(ads);
    }
  );
});

module.exports = router;
