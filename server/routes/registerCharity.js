const express = require("express");
const router = express.Router();
const supabase = require("../config/dbConfig");

router.post("/", async(req, res) => {

  try {
    let info = req.body;
    console.log(info)
    let {error} = await supabase.from('Charity').insert([{
      name: info.name,
      long: info.long,
      lat: info.lat,
      website: info.web,
      number: info.phone,
      user:info.userId,
    }]);

    if(error){
      console.log("Error writing to DB: "+ error.message);
    }else{
      console.log("success registering charity");
      res.send(true);
    }
  }
 
catch (e) {
  console.log("ERROR WRITING TO DB: " + e);
}

      
});

module.exports = router;
