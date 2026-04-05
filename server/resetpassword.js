const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

async function resetAll() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected");

  const db = mongoose.connection.db;
  const users = await db.collection("users").find({}).toArray();
  console.log("Found users:", users.length);

  for (const user of users) {
    const salt = await bcrypt.genSalt(12);
    const hash = await bcrypt.hash("Admin@1234", salt);
    await db.collection("users").updateOne(
      { _id: user._id },
      { $set: { password: hash } }
    );
    console.log("Reset password for:", user.email);
  }

  const testUser = await db.collection("users").findOne({ email: "admin@church.org" });
  const match = await bcrypt.compare("Admin@1234", testUser.password);
  console.log("Login test for admin@church.org:", match ? "SUCCESS" : "FAILED");

  process.exit(0);
}

resetAll().catch(e => { console.log("Error:", e.message); process.exit(1); });
