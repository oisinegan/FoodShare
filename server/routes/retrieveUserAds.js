const express = require("express");
const router = express.Router();
const connection = require("../config/dbConfig");
const supabase = require("../config/dbConfig");

router.post("/", async(req, res) => {

  try{
    let info = req.body;
    console.log(info);
    console.log("getting posts for: "+ info.user.id);
    const {data,error} = await supabase.from('ads').select('*').eq('userId',info.user.id);

    if(error) throw error;
    res.send(data);

  }catch(e){
    console.log("E: "+ e);
  }
  // let info = req.body;
  // console.log(info);
  // connection.connect();
  // console.log(info.id);

  // connection.query(
  //   "SELECT * FROM ads WHERE userId= " + info.user.id + ";",

  //   (err, rows, fields) => {
  //     if (err) throw err;
  //     const ads = [];
  //     rows.forEach((row) => {
  //       const {
  //         id,
  //         item,
  //         image_url,
  //         brand,
  //         userId,
  //         expiryDate,
  //         size,
  //         measurementType,
  //         quant,
  //         extraInfo,
  //         datePosted,
  //         timePosted,
  //         postTo,
  //         long,
  //         lat,
  //       } = row;
  //       ads.push({
  //         id,
  //         item,
  //         image_url,
  //         brand,
  //         userId,
  //         expiryDate,
  //         size,
  //         measurementType,
  //         quant,
  //         extraInfo,
  //         datePosted,
  //         timePosted,
  //         postTo,
  //         long,
  //         lat,
  //       });
  //     });
  //     console.log("ADS");
  //     console.log(ads);
  //     res.send(ads);
  //   }
  // );
});

module.exports = router;
