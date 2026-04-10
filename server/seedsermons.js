const { PrismaClient } = require("@prisma/client");
const cloudinary = require("cloudinary").v2;
require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const prisma = new PrismaClient();

async function main() {
  console.log("Fetching sample assets from your Cloudinary account...");

  // List all files in scoe-sermons folder
  let videos = [];
  let audios = [];
  let pdfs = [];

  try {
    const videoRes = await cloudinary.api.resources({
      type: "upload",
      resource_type: "video",
      prefix: "scoe-sermons",
      max_results: 10,
    });
    videos = videoRes.resources || [];
    console.log(`Found ${videos.length} video(s)`);
  } catch (e) { console.log("No videos found:", e.message); }

  try {
    const audioRes = await cloudinary.api.resources({
      type: "upload",
      resource_type: "video", // Cloudinary stores audio under "video"
      prefix: "scoe-sermons/audio",
      max_results: 10,
    });
    audios = audioRes.resources || [];
    console.log(`Found ${audios.length} audio(s)`);
  } catch (e) { console.log("No audios found:", e.message); }

  try {
    const pdfRes = await cloudinary.api.resources({
      type: "upload",
      resource_type: "raw",
      prefix: "scoe-sermons/pdfs",
      max_results: 10,
    });
    pdfs = pdfRes.resources || [];
    console.log(`Found ${pdfs.length} PDF(s)`);
  } catch (e) { console.log("No PDFs found:", e.message); }

  // Delete old sermons
  await prisma.sermon.deleteMany({});
  console.log("Cleared old sermons");

  const sermons = [];

  // Create sermon entries for each uploaded file
  for (const video of videos) {
    sermons.push({
      title: formatTitle(video.public_id),
      description: "A powerful sermon from Sabbathtarian Church of Elohim. Auto-imported from uploaded media.",
      speaker: "Church Minister",
      date: new Date(video.created_at),
      type: "video",
      fileUrl: video.secure_url,
      videoLink: null,
      isPremium: false,
      price: 0,
      isPublished: true,
    });
  }

  for (const audio of audios) {
    sermons.push({
      title: formatTitle(audio.public_id),
      description: "An audio sermon from Sabbathtarian Church of Elohim. Listen and be blessed.",
      speaker: "Church Minister",
      date: new Date(audio.created_at),
      type: "audio",
      fileUrl: audio.secure_url,
      videoLink: null,
      isPremium: false,
      price: 0,
      isPublished: true,
    });
  }

  for (const pdf of pdfs) {
    sermons.push({
      title: formatTitle(pdf.public_id),
      description: "A sermon document from Sabbathtarian Church of Elohim. Read and study at your own pace.",
      speaker: "Church Minister",
      date: new Date(pdf.created_at),
      type: "pdf",
      fileUrl: pdf.secure_url,
      videoLink: null,
      isPremium: false,
      price: 0,
      isPublished: true,
    });
  }

  if (sermons.length === 0) {
    console.log("\nNo uploaded files found in Cloudinary yet.");
    console.log("Adding placeholder sermons instead...");

    // Add placeholder sermons so the page is not empty
    await prisma.sermon.createMany({
      data: [
        {
          title: "The Sabbath: A Divine Gift",
          description: "Understanding the sacredness of the seventh-day Sabbath as commanded by Elohim.",
          speaker: "Pastor James Kariuki",
          date: new Date("2026-04-05"),
          type: "video",
          videoLink: null,
          fileUrl: null,
          isPremium: false,
          price: 0,
          isPublished: true,
        },
        {
          title: "Walking in Torah: Practical Holiness",
          description: "How to apply the Torah to everyday life as a believer in the 21st century.",
          speaker: "Elder Moses Kamau",
          date: new Date("2026-03-29"),
          type: "audio",
          videoLink: null,
          fileUrl: null,
          isPremium: false,
          price: 0,
          isPublished: true,
        },
        {
          title: "The Feasts of Elohim Explained",
          description: "A deep dive into the seven feasts of YHWH and their prophetic significance.",
          speaker: "Pastor James Kariuki",
          date: new Date("2026-03-22"),
          type: "pdf",
          videoLink: null,
          fileUrl: null,
          isPremium: false,
          price: 0,
          isPublished: true,
        },
        {
          title: "Passover: From Egypt to Eternity (Premium)",
          description: "The Passover story and its redemptive significance for believers today.",
          speaker: "Pastor James Kariuki",
          date: new Date("2026-03-08"),
          type: "video",
          videoLink: null,
          fileUrl: null,
          isPremium: true,
          price: 200,
          isPublished: true,
        },
      ],
    });
    console.log("4 placeholder sermons created.");
  } else {
    await prisma.sermon.createMany({ data: sermons });
    console.log(`\n✅ ${sermons.length} sermon(s) seeded from your Cloudinary uploads!`);
    sermons.forEach(s => console.log(` - [${s.type.toUpperCase()}] ${s.title}`));
  }

  await prisma.$disconnect();
}

function formatTitle(publicId) {
  // Convert "scoe-sermons/videos/my-sermon-file" -> "My Sermon File"
  const filename = publicId.split("/").pop();
  return filename
    .replace(/[-_]/g, " ")
    .replace(/\.[^/.]+$/, "") // remove extension
    .replace(/\b\w/g, l => l.toUpperCase())
    .trim() || "Sermon";
}

main().catch(e => { console.error(e.message); process.exit(1); });
