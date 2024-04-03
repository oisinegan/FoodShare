const express = require("express");
const router = express.Router();
const connection = require("../config/dbConfig");
const supabase = require("../config/dbConfig");

router.get("/", async(req, res) => {
  try{
    const {data,error} = await supabase.from('Charity').select('*');

    if(error){
      console.log("ERROR: "+ error);
    }
    if(!data){
      console.log("No Charities found")
    }
    console.log("charity: ")
    console.log(data);
    res.send(data)
    
  }catch(e){
    console.log("ERR: "+e)
  }

  
});

module.exports = router;
