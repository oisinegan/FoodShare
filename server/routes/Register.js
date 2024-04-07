const express = require("express");
const router = express.Router();
const supabase = require("../config/dbConfig");
const bycrpt = require("bcrypt");

router.post("/", async (req, res) => {
  let info = req.body;
  let { data, error } = await supabase
    .from("User")
    .select("email")
    .eq("email", info.email);

  if (error) throw error;

  if (data.length > 0) {
    res.send(false);
  } else {
    const hashedPassword = await bycrpt.hash(info.password, 10);
    let { error } = await supabase
      .from("User")
      .insert([{ name: info.name, email: info.email, pass: hashedPassword }]);
    if (error) throw error;
    res.send(true);
  }
});

module.exports = router;
