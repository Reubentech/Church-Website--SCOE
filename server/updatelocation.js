const mongoose = require("mongoose");
require("dotenv").config();
mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const Event = require("./src/models/Event.model");
  const result = await Event.updateMany({}, { $set: { location: "Nyahururu, Kenya" } });
  console.log("Updated", result.modifiedCount, "events to Nyahururu, Kenya");
  process.exit(0);
}).catch(e => { console.log("Error:", e.message); process.exit(1); });
