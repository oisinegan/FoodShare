const express = require("express");
const router = express.Router();
const supabase = require("../config/dbConfig");

router.post("/", async (req, res) => {
  let info = req.body;
  console.log(info.otherUser);
  console.log(info.userN);

  try {
    const { data: userN_data, error: userN_error } = await supabase
      .from("User")
      .select("points")
      .eq("name", info.userN)
      .single();
    if (userN_error) throw userN_error;
    const userN_points = userN_data.points + 5;

    const { data, error } = await supabase
      .from("User")
      .update({ points: userN_points })
      .eq("name", info.userN);
    if (error) throw error;
    console.log("UPDATED user points: " + info.userN);
  } catch (e) {
    console.log("ERROR from addSharePoints: " + e.message);
  }
  try {
    const { data: otherUser_data, error: otherUser_error } = await supabase
      .from("User")
      .select("points")
      .eq("name", info.otherUser)
      .single();
    if (otherUser_error) throw otherUser_error;
    const otherUser_points = otherUser_data.points + 5;

    const { data, error } = await supabase
      .from("User")
      .update({ points: otherUser_points })
      .eq("name", info.otherUser);
    if (error) throw error;
    console.log("UPDATED user points2: " + info.otherUser);
  } catch (e) {
    console.log("ERROR from addSharePoints: " + e.message);
  }
  res.send(true);
});

module.exports = router;
