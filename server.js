const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

/* Home */
app.get("/", (req,res)=>{
  res.send("ShredBoost API running");
});

/* Health Check */
app.get("/health",(req,res)=>{
  res.json({
    status:"ok"
  });
});

/* AI Coach GET test route (browser test) */
app.get("/ai-coach",(req,res)=>{
  res.json({
    reply:"AI Coach active. Backend connected successfully."
  });
});

/* AI Coach POST route (Flutter app uses this) */
app.post("/ai-coach",(req,res)=>{
  try {

    const prompt = req.body.prompt || "";

    // Temporary demo AI response
    let response =
      "Train hard 💪 prioritize protein, hydration, recovery, and progressive overload.";

    if(prompt.toLowerCase().includes("weight loss")){
      response =
      "For fat loss: maintain calorie deficit, high protein, strength train 3-5x/week, and walk daily.";
    }

    if(prompt.toLowerCase().includes("muscle")){
      response =
      "For muscle gain: progressive overload, surplus calories, 0.8-1g protein per lb bodyweight.";
    }

    res.json({
      success:true,
      reply: response
    });

  } catch(error){

    res.status(500).json({
      success:false,
      error:"AI Coach error"
    });

  }
});

const PORT = process.env.PORT || 10000;

app.listen(PORT, ()=>{
  console.log("Running on " + PORT);
});
