const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const prisma = new PrismaClient();

async function main() {
  console.log("Connecting to Neon PostgreSQL...");

  const users = [
    { name: "Church Admin", email: "admin@church.org", password: "Admin@1234", role: "admin" },
    { name: "Reuben Kariuki", email: "reuben@church.org", password: "Reuben@1234", role: "admin" },
    { name: "Church Member", email: "member@church.org", password: "Member@1234", role: "user" },
  ];

  for (const u of users) {
    const salt = await bcrypt.genSalt(12);
    const hash = await bcrypt.hash(u.password, salt);
    await prisma.user.upsert({
      where: { email: u.email },
      update: { password: hash, role: u.role, name: u.name },
      create: { name: u.name, email: u.email, password: hash, role: u.role }
    });
    console.log("Ready:", u.email, "| Password:", u.password, "| Role:", u.role);
  }

  console.log("\n========================================");
  console.log("LOGIN CREDENTIALS");
  console.log("========================================");
  users.forEach(u => {
    console.log(`Email:    ${u.email}`);
    console.log(`Password: ${u.password}`);
    console.log(`Role:     ${u.role}`);
    console.log("----------------------------------------");
  });

  process.exit(0);
}

main().catch(e => { console.error(e.message); process.exit(1); });
