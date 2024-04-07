const express = require("express");
const router = express.Router();
const connection = require("../config/dbConfig");
const supabase = require("../config/dbConfig");

router.post("/", async (req, res) => {
  try {
    console.log("Get users");
    let info = req.body;
    console.log(info.id);
    const { data, error } = await supabase
      .from("applicants")
      .select("*")
      .eq("adId", info.id);
    if (error) throw error;
    console.log(data);

    //Get user ids from data
    const userIds = data.map((user) => user.userInterested);
    console.log(userIds);
    try {
      //const{data,error} = await supabase.from('User').select('id,email, name, url, points, long, lat').in('id',userIds);
      const { data, error } = await supabase
        .from("User")
        .select("*")
        .in("id", userIds);
      if (error) {
        console.log("ERRROR 1");
        console.log(error);
      }
      console.log(data);
      res.send(data);
    } catch (e) {
      console.log("E: " + e);
    }
  } catch (e) {
    console.log("e: " + e.message);
  }
});

module.exports = router;
