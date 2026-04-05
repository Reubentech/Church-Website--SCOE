const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, default: "admin" }
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");
    const exists = await User.findOne({ email: "admin@church.org" });
    if (exists) { console.log("Admin already exists!"); process.exit(0); }
    const hashed = await bcrypt.hash("Admin@1234", 12);
    await User.create({ name: "Church Admin", email: "admin@church.org", password: hashed, role: "admin" });
    console.log("Admin created! Email: admin@church.org | Password: Admin@1234");
    process.exit(0);
  } catch (err) {
    console.error("Error:", err.message);
    process.exit(1);
  }
}
seed();
