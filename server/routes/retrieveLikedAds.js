const express = require("express");
const router = express.Router();
const connection = require("../config/dbConfig");

router.post("/", (req, res) => {
  let info = req.body;
  console.log(info);
  connection.connect();
  console.log(info.id);

  connection.query(
    "SELECT ads.* FROM ads INNER JOIN applicants ON ads.id = applicants.adId WHERE applicants.userInterested = " +
      info.user.id +
      ";",

    (err, rows, fields) => {
      if (err) throw err;
      const ads = [];
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
      console.log("USER LIKED ADS");
      console.log(ads);
      res.send(ads);
    }
  );
});

module.exports = router;
