const express = require("express");
const router = express.Router();
const supabase = require("../config/dbConfig");

router.post("/", async (req, res) => {
  let info = req.body;
  console.log(info.result);
  console.log(info.id);

  if (info.result === true) {
    try {
      const { data, error } = await supabase
        .from("PendingCharity")
        .select("*")
        .eq("id", info.id)
        .single();

      if (error) {
        console.log("ERROR1: " + error.message);
      }
      if (!data) {
        console.log("No charity founds1");
      }
      console.log(data);

      let { error: err } = await supabase.from("Charity").insert([
        {
          id: data.id,
          name: data.name,
          long: data.long,
          lat: data.lat,
          website: data.website,
          user: data.user,
        },
      ]);

      if (err) {
        console.log("Error writing to DB1: " + err.message);
      } else {
        console.log("success inserting pending charity share");
      }
    } catch (e) {
      console.log("e1: " + e);
    }
  }

  const { error } = await supabase
    .from("PendingCharity")
    .delete()
    .eq("id", info.id);

  if (error) throw error;

  console.log("Success deleting charity from pending");
  res.send(true);

  //   try {
  //     let info = req.body;
  //     console.log(info)
  //     let {data,error} = await supabase.from('User').select('url, points')
  //     .eq('id', info.user.id);

  //     if(error){
  //       console.log("Error: "+ error.message);
  //     }else{
  //       console.log("userInfo");

  //       console.log(data);
  //       res.send(data);
  //     }
  //   }

  // catch (e) {
  //   console.log("ERROR: " + e);
  // }
});

module.exports = router;
