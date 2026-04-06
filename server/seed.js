require("dotenv").config();
const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function seed() {
  try {
    const email = process.env.ADMIN_EMAIL || "admin@church.org";
    const password = process.env.ADMIN_PASSWORD || "Admin@1234";
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) { console.log(`Admin already exists: ${email}`); return; }
    const hashed = await bcrypt.hash(password, 12);
    await prisma.user.create({ data: { name: "Church Admin", email, password: hashed, role: "admin" } });
    console.log(`Admin created! Email: ${email} | Password: ${password}`);
  } catch (err) {
    console.error("Error:", err.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}
seed();
