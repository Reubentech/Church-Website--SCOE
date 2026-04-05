const mongoose = require("mongoose");
require("dotenv").config();

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const Blog = require("./src/models/Blog.model");
  const Bulletin = require("./src/models/Bulletin.model");

  await Blog.deleteMany({});
  await Blog.insertMany([
    {
      title: "The Sacred Meaning of the Sabbath",
      content: "The Sabbath is not merely a day of rest — it is a divine appointment between Elohim and His people. From the very beginning of creation, Elohim set apart the seventh day as holy. In Exodus 20:8-10, we are commanded to remember the Sabbath day and keep it holy. This weekly observance is a sign of the covenant between Elohim and His people, a reminder that He is our Creator and Sustainer.\n\nWhen we observe the Sabbath, we acknowledge that our time belongs to Elohim. We cease from our own labors and enter into His rest. This is a profound spiritual discipline that transforms our relationship with the Creator.\n\nLet us commit to honoring the Sabbath with joy, reverence, and wholehearted devotion.",
      excerpt: "The Sabbath is a divine appointment between Elohim and His people — a weekly sign of the covenant.",
      author: "Pastor James Kariuki",
      category: "teaching",
      isPublished: true,
      views: 45,
    },
    {
      title: "My Testimony: How Elohim Healed My Family",
      content: "Three years ago, my family was on the verge of collapse. My marriage was broken, my children were wayward, and I had lost my job. In desperation, I cried out to Elohim.\n\nA friend invited me to the Sabbathtarian Church of Elohim, and for the first time in years, I felt the presence of the Almighty in worship. Through the prayers of the congregation and the faithful teaching of the Word, Elohim began to restore everything that the enemy had stolen.\n\nToday, my marriage is restored, my children walk in the truth, and I have a new business that Elohim has blessed abundantly. To Him be all the glory!",
      excerpt: "A powerful testimony of family restoration through faith and the power of Elohim.",
      author: "Sister Ruth Wanjiku",
      category: "testimony",
      isPublished: true,
      views: 78,
    },
    {
      title: "Morning Devotional: Seeking Elohim at Dawn",
      content: "The early morning hours are a sacred time to meet with Elohim. Before the demands of the day take over, we have the opportunity to present ourselves before the throne of grace.\n\nPsalm 5:3 says: 'My voice shalt thou hear in the morning, O LORD; in the morning will I direct my prayer unto thee, and will look up.'\n\nBegin each day with gratitude, scripture reading, and prayer. Ask Elohim to guide your steps, purify your heart, and fill you with His Spirit. The morning watch is not a ritual — it is a love appointment with the Creator of the universe.\n\nMay your mornings be filled with His presence and your days with His blessing.",
      excerpt: "Start each day in the presence of Elohim — a morning devotional to strengthen your walk of faith.",
      author: "Elder Moses Kamau",
      category: "devotional",
      isPublished: true,
      views: 32,
    },
    {
      title: "Church Picnic & Community Day — Save the Date!",
      content: "We are excited to announce our annual Church Picnic and Community Day! This year, we will be hosting the event at Nyahururu County Park on Saturday, June 14, 2026.\n\nThe day will include worship, games, food, and fellowship for the entire family. We invite all members, their families, and friends from the community to join us for this wonderful occasion.\n\nVolunteers are needed for setup, cooking, and children activities. Please contact the church office to sign up. Let us come together as one family in Elohim!",
      excerpt: "Join us for our annual Church Picnic and Community Day in Nyahururu on June 14, 2026.",
      author: "Church Administration",
      category: "announcement",
      isPublished: true,
      views: 56,
    },
    {
      title: "Understanding the Torah: A Beginner's Guide",
      content: "The Torah — the first five books of the Bible — forms the foundation of our faith. It contains the commandments, statutes, and ordinances that Elohim gave to His people through Moses at Mount Sinai.\n\nMany believers feel intimidated by the Torah, but it is actually a beautiful and practical guide for righteous living. In this teaching, we will explore the major themes of the Torah: Creation, the Covenant, the Law, and the Promised Land.\n\nGenesis reveals Elohim as Creator. Exodus shows us the power of redemption. Leviticus teaches us about holiness and sacrifice. Numbers speaks of the wilderness journey. Deuteronomy calls us to love Elohim with all our heart.\n\nStudying the Torah is not legalism — it is love for our Father and His instructions.",
      excerpt: "A beginner-friendly guide to understanding the Torah and its relevance to our faith today.",
      author: "Pastor James Kariuki",
      category: "teaching",
      isPublished: true,
      views: 89,
    },
  ]);

  await Bulletin.deleteMany({});
  await Bulletin.insertMany([
    {
      title: "Sabbath Bulletin — May 10, 2026",
      week: "Week of May 10, 2026",
      date: new Date("2026-05-10"),
      content: "Shabbat Shalom, beloved family of Elohim! Welcome to our Sabbath worship service. We are glad you are here. May this day be a blessing and refreshment to your soul.",
      scripture: "Isaiah 58:13-14 — If you turn away your foot from the Sabbath, from doing your pleasure on My holy day, and call the Sabbath a delight, the holy day of the LORD honorable...",
      announcements: [
        "Bible Study continues every Wednesday at 6:00 PM in the main hall",
        "Youth meeting this Saturday at 3:00 PM — all youth are encouraged to attend",
        "Community outreach program on May 23rd — volunteers needed, please sign up at the door",
        "Tithes and offerings can now be paid via M-Pesa — Paybill 400200, Account: SCE",
        "New members class starts June 1st — speak to Elder Moses for registration"
      ],
      isPublished: true,
    },
    {
      title: "Sabbath Bulletin — May 3, 2026",
      week: "Week of May 3, 2026",
      date: new Date("2026-05-03"),
      content: "Shabbat Shalom! Welcome to the house of Elohim. Today we continue our series on the Tabernacle and its deep spiritual significance for believers today.",
      scripture: "Exodus 25:8 — And let them make Me a sanctuary, that I may dwell among them.",
      announcements: [
        "Prayer and fasting day scheduled for May 13th — join us from 6 AM",
        "Special Passover service on June 6th — dress code is white attire",
        "Church bulletin is now available on our website every Sabbath",
        "Congratulations to Brother David and Sister Mary on their new baby!",
      ],
      isPublished: true,
    },
  ]);

  console.log("Blog posts and bulletins created successfully!");
  process.exit(0);
}).catch(e => { console.log("Error:", e.message); process.exit(1); });
