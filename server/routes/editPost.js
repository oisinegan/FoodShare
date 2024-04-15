const express = require("express");
const router = express.Router();
const supabase = require("../config/dbConfig");
router.use(express.json());
router.post("/", async (req, res) => {
  try {
    let body = req.body;
    console.log("EDIT INFORMATION");
    console.log(body);
    console.log(body.info.foodName);

    const {data,error} = await supabase.from('ads').update({
        item: body.info.foodName,
        brand: body.info.brand,
        size: body.info.size,
        quant: body.info.quant,
        extraInfo: body.info.extraInfo,
        measurementType: body.info.measurementType}).eq('id',body.info.id);

    if(error)throw error;

    console.log("UPDATE SUCCESS");
    res.send(true)

    
}catch(e){
    console.log("Error in edit post: "+ e.message);
} });

module.exports = router;
