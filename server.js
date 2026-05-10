const express = require("express");
const cors = require("cors");
require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

const app = express();
app.post(
  "/stripe-webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];

    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        endpointSecret
      );
    } catch (err) {
      console.log("Webhook signature failed:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      console.log("Payment completed:", {
        customerEmail: session.customer_email,
        subscriptionId: session.subscription,
        priceId: session.metadata?.priceId,
        plan: session.metadata?.plan,
      });

      // Pwochen etap: update Firestore user subscription isit la
    }

    res.json({ received: true });
  }
);
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

/* AI Coach GET test route (browser test) */
app.get("/ai-coach",(req,res)=>{
  res.json({
    reply:"AI Coach active. Backend connected successfully."
  });
});

// 🔥 METE LI ANBA LA
app.post("/create-checkout-session", async (req, res) => {
  const { priceId } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],

      // 🔥 FREE TRIAL
      subscription_data: {
        trial_period_days: 7,
      },

      success_url: "https://shredboost-api.onrender.com",
      cancel_url: "https://shredboost-api.onrender.com",
    });

    res.json({ url: session.url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
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
