const express = require("express");
const router = express.Router();
const supabase = require("../config/dbConfig");

router.post("/", async (req, res) => {
  let info = req.body;
  console.log(info);
  console.log(info.id);
  try{
    const {data,error} = await supabase.from('ads').select('*').neq('userId',info.id);

    if(error){
      console.log("ERROR: "+ error);
    }
    if(!data){
      console.log("No ads found")
    }
    console.log("ADS: ")
    console.log(data);
    res.send(data)

  }catch(err){
    console.log("Error fetching: " + err.message);
  }

 
});

module.exports = router;
