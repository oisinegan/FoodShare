const express = require("express");
const router = express.Router();
const connection = require("../config/dbConfig");
const bycrpt = require("bcrypt");

router.post("/", (req, res) => {
  connection.connect();
  let info = req.body;
  console.log(info)

        const sql =
          "SELECT * FROM ads where id = '" +
          info.AdId +
          "';";
        connection.query(sql, (err, rows, fields) => {
          if (err) throw err;
          console.log(rows[0]);
          const sql2 =
          "INSERT INTO CompletedShares (`user`, `otherUser`, `AdId`,  `item`, `image_url`, `brand`, `expiryDate`, `size`, `measurementType`, `quant`, `extraInfo`, `datePosted`, `timePosted`, `postTo`, `long`, `lat`) VALUES ('" +
          info.userN +
          "', '" +
          info.otherUser +
          "', '" +
          info.AdId +
          "', '" +
          rows[0].item +
          "', '" +
          rows[0].image_url +
          "', '" +
          rows[0].brand +
          "', '" +
          rows[0].expiryDate +
          "', '" +
          rows[0].size +
          "', '" +
          rows[0].measurementType +
          "', '" +
          rows[0].quant +
          "', '" +
          rows[0].extraInfo +
          "', '" +
          rows[0].datePosted +
          "', '" +
          rows[0].timePosted +
          "', '" +
          rows[0].postTo +
          "', '" +
          rows[0].long +
          "', '" +
          rows[0].lat +
          "')";
          connection.query(sql2, (err, rows, fields) => {
            if (err) throw err;
            res.send(true);
          });
          
        });
      
  
});

module.exports = router;
