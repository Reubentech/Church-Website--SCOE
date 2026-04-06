const { PrismaClient } = require("@prisma/client");

const prisma = global.prisma || new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

if (process.env.NODE_ENV !== "production") global.prisma = prisma;

// Reconnect helper for Neon cold starts
async function withRetry(fn, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (err) {
      const isConnectionErr = err.message?.includes("Can't reach database") ||
        err.message?.includes("Connection refused") ||
        err.code === "P1001";
      if (isConnectionErr && i < retries - 1) {
        await new Promise(r => setTimeout(r, 1500 * (i + 1)));
        continue;
      }
      throw err;
    }
  }
}

module.exports = prisma;
module.exports.withRetry = withRetry;
