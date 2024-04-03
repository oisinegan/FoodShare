const express = require("express");
const router = express.Router();
const connection = require("../config/dbConfig");
const bycrpt = require("bcrypt");
const supabase = require("../config/dbConfig");

router.post("/", async(req, res) => {
try{
  let info = req.body;
  console.log("info")
  console.log(info.AdId)
  const { data, error } = await supabase.from('ads').select('*').eq('id', info.AdId).single();
  
  if(error){
    console.log("ERROR1: "+ error.message);
  }
  if(!data){
    console.log("No ads founds1")
  }
  console.log(data)

  let {err} = await supabase.from('CompletedShares').insert([{
    user: info.userN,
    otherUser: info.otherUser,
    AdId:info.AdId,
    item: data.item ,
    image_url: data.image_url,
    brand:  data.brand,
    expiryDate: data.expiryDate,
    size:  data.size,
    measurementType:  data.measurementType,
    quant:  data.quant,
    extraInfo:    data.extraInfo,
    datePosted:  data.datePosted,
    timePosted:  data.timePosted,
    postTo:  data.postTo,
    long:  data.long,
    lat: data.lat
  }]);

  if(err){
    console.log("Error writing to DB1: "+ err.message);
  }else{
    console.log("success completing share");
    res.send(true);
  }

}catch(e){
  console.log("e1: "+ e);
}
  
});

module.exports = router;
