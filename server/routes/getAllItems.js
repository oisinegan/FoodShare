const express = require("express");
const router = express.Router();
const connection = require("../config/dbConfig");

router.get("/", (req, res) => {
  connection.connect();

  connection.query(
    "SELECT * FROM ads;",

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
