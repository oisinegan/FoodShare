const express = require("express");
const router = express.Router();
const connection = require("../config/dbConfig");

router.post("/", (req, res) => {
  let info = req.body;
  console.log(info);
  connection.connect();
  console.log(info.item.id);
  connection.query(
    "SELECT * FROM applicants WHERE adId= " + info.item.id + ";",

    (err, rows, fields) => {
      if (err) throw err;
      const ads = [{}];
      rows.forEach((row) => {
        const { id, userInterested, userName } = row;
        ads.push({
          id,
          userInterested,
          userName,
        });
      });
      res.send(ads);
    }
  );
});

module.exports = router;
