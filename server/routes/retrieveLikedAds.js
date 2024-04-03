const express = require("express");
const router = express.Router();
const connection = require("../config/dbConfig");
const supabase = require("../config/dbConfig");
const { trace } = require("./Login");

router.post("/", async(req, res) => {

  try{
    let info = req.body;
    console.log(info);

    const {data:userIds,error} = await supabase.from('applicants').select('adId').eq('userInterested',info.user.id);
    if(error) throw error;
    console.log("USER LIKED ADS");
    console.log(userIds);
    const ids = userIds.map(id=>id.adId);
    console.log(ids);
    try{
      const{data,error} = await supabase.from('ads').select('*').in('id', ids);
       if(error){
        console.log("ERRROR 1")
         console.log(error)
       }
    console.log(data);
    res.send(data)
    }catch(e){
      console.log("E: "+e);
    }


  }catch(e){
    console.log("error retreive liked ads: " + e);
  }
  
});

module.exports = router;
