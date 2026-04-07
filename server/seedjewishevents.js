const { PrismaClient } = require("@prisma/client");
require("dotenv").config();

const prisma = new PrismaClient();

async function main() {
  console.log("Connecting to Neon PostgreSQL...");

  const events = [

    // ── SPRING FEASTS ──────────────────────────────────
    {
      title: "Passover — Pesach (Seder Night)",
      description: "The Feast of Passover commemorates the deliverance of Israel from bondage in Egypt. We observe this sacred feast as commanded in Exodus 12 and Leviticus 23. We gather for a Passover Seder meal, reading of the Haggadah and special worship. Dress code: white attire. All families welcome.",
      date: new Date("2026-04-02"),
      time: "6:00 PM",
      location: "Nyahururu, Kenya",
      category: "special",
      isPublished: true
    },
    {
      title: "Feast of Unleavened Bread — Day 1",
      description: "The first day of the Feast of Unleavened Bread (Chag HaMatzot). For seven days we eat unleavened bread as commanded in Exodus 12:15-20. This feast reminds us to remove sin (leaven) from our lives. A holy convocation — no work permitted. Special morning service.",
      date: new Date("2026-04-02"),
      time: "10:00 AM",
      location: "Nyahururu, Kenya",
      category: "special",
      isPublished: true
    },
    {
      title: "Feast of Unleavened Bread — Final Day (Day 7)",
      description: "The seventh and final day of the Feast of Unleavened Bread. A holy convocation. We celebrate Elohim's complete deliverance, remembering how He parted the Red Sea. Special closing service with communion. No leaven in the home this week.",
      date: new Date("2026-04-08"),
      time: "10:00 AM",
      location: "Nyahururu, Kenya",
      category: "special",
      isPublished: true
    },
    {
      title: "First Fruits — Yom HaBikkurim",
      description: "The Feast of First Fruits is the day Yeshua rose from the dead — the First Fruit of the resurrection (1 Corinthians 15:20-23). We celebrate by bringing first fruit offerings to Elohim as commanded in Leviticus 23:9-14. Special offering service. Bring your first fruits.",
      date: new Date("2026-04-05"),
      time: "10:00 AM",
      location: "Nyahururu, Kenya",
      category: "special",
      isPublished: true
    },
    {
      title: "Shavuot — Feast of Weeks (Pentecost)",
      description: "Shavuot commemorates the giving of the Torah at Mount Sinai and the outpouring of the Holy Spirit (Acts 2). Observed 50 days after First Fruits. We gather for all-night Torah study, reading of Ruth and a special morning worship service. A holy convocation — no work permitted.",
      date: new Date("2026-05-21"),
      time: "6:00 PM",
      location: "Nyahururu, Kenya",
      category: "special",
      isPublished: true
    },

    // ── SUMMER ─────────────────────────────────────────
    {
      title: "Tisha B'Av — Day of Fasting & Mourning",
      description: "Tisha B'Av commemorates the destruction of both the First and Second Temples in Jerusalem. We gather to fast from sunset to nightfall, read the Book of Lamentations and pray for the restoration of Israel and the coming Kingdom of Elohim. A solemn and reflective day.",
      date: new Date("2026-07-23"),
      time: "6:00 PM",
      location: "Nyahururu, Kenya",
      category: "prayer",
      isPublished: true
    },

    // ── FALL HIGH HOLY DAYS ────────────────────────────
    {
      title: "Rosh Hashanah — Hebrew New Year 5787",
      description: "Rosh Hashanah marks the beginning of Hebrew year 5787 and the Ten Days of Awe. We gather for special services featuring the blowing of the Shofar (ram's horn) as commanded in Leviticus 23:24. A time of reflection, repentance and renewal. Traditional foods: apples dipped in honey for a sweet new year.",
      date: new Date("2026-09-11"),
      time: "6:00 PM",
      location: "Nyahururu, Kenya",
      category: "special",
      isPublished: true
    },
    {
      title: "Ten Days of Awe — Daily Prayer & Repentance",
      description: "The Ten Days of Awe (Yamim Noraim) between Rosh Hashanah and Yom Kippur are a sacred time of self-examination and returning to Elohim. Daily prayer meetings every morning at 6 AM. Seek Elohim while He may be found (Isaiah 55:6). All are encouraged to attend.",
      date: new Date("2026-09-12"),
      time: "6:00 AM",
      location: "Nyahururu, Kenya",
      category: "prayer",
      isPublished: true
    },
    {
      title: "Yom Kippur — Day of Atonement",
      description: "Yom Kippur is the holiest day of the Hebrew year — a 25-hour fast and day of intense prayer as commanded in Leviticus 23:27-32. Services: Kol Nidrei at sunset, morning and afternoon services, reading of Jonah, and Neilah (closing) service at nightfall. No food, drink or work. Come seek the face of Elohim.",
      date: new Date("2026-09-20"),
      time: "6:00 PM",
      location: "Nyahururu, Kenya",
      category: "special",
      isPublished: true
    },
    {
      title: "Sukkot — Feast of Tabernacles (Day 1)",
      description: "Sukkot begins — one of the three Pilgrimage Feasts commanded in Leviticus 23:33-43. We build a Sukkah (temporary booth) and dwell in it for seven days to remember how Elohim sheltered Israel in the wilderness. A season of great joy and thanksgiving. Families especially encouraged to attend.",
      date: new Date("2026-09-25"),
      time: "6:00 PM",
      location: "Nyahururu, Kenya",
      category: "special",
      isPublished: true
    },
    {
      title: "Hoshana Raba — 7th Day of Sukkot",
      description: "Hoshana Raba is the seventh and final day of Sukkot — the last chance for repentance before the heavenly court is sealed. A special extended morning service with the waving of the four species and seven circuits of prayer. Join us for this meaningful day of prayer and thanksgiving.",
      date: new Date("2026-10-01"),
      time: "9:00 AM",
      location: "Nyahururu, Kenya",
      category: "worship",
      isPublished: true
    },
    {
      title: "Shemini Atzeret & Simchat Torah",
      description: "Shemini Atzeret (Eighth Day of Assembly) and Simchat Torah (Rejoicing of the Torah) — we complete and restart the annual Torah reading cycle. We dance with the Torah, sing praises to Elohim and celebrate His Word. A joyful and festive occasion for the whole congregation!",
      date: new Date("2026-10-02"),
      time: "6:00 PM",
      location: "Nyahururu, Kenya",
      category: "special",
      isPublished: true
    },

    // ── WINTER ─────────────────────────────────────────
    {
      title: "Hanukkah — Festival of Lights (First Night)",
      description: "Hanukkah commemorates the miracle of the oil in the Temple and the Maccabean victory. Yeshua observed Hanukkah (John 10:22). We light the first candle of the Hanukkiah, sing songs, share food and celebrate Elohim's faithfulness. Bring your whole family!",
      date: new Date("2026-12-04"),
      time: "6:00 PM",
      location: "Nyahururu, Kenya",
      category: "special",
      isPublished: true
    },
    {
      title: "Hanukkah — Festival of Lights (Eighth Night)",
      description: "The eighth and final night of Hanukkah! We light all eight candles together in a special closing ceremony. A festive evening of music, food (doughnuts and latkes), and thanksgiving. All members and families warmly invited to celebrate the light of Elohim shining in the darkness.",
      date: new Date("2026-12-12"),
      time: "6:00 PM",
      location: "Nyahururu, Kenya",
      category: "special",
      isPublished: true
    },

    // ── PURIM ───────────────────────────────────────────
    {
      title: "Purim — Feast of Esther",
      description: "Purim celebrates the miraculous deliverance of the Jewish people from Haman in the days of Queen Esther in Persia (Book of Esther). We read the Megillah (Book of Esther), dress in costumes, share Mishloach Manot (gift baskets) and give to the poor. A joyful and festive celebration of Elohim's hidden hand in history.",
      date: new Date("2026-03-03"),
      time: "6:00 PM",
      location: "Nyahururu, Kenya",
      category: "special",
      isPublished: true
    },

    // ── WEEKLY SABBATH ──────────────────────────────────
    {
      title: "Weekly Sabbath Worship Service",
      description: "Join us every Sabbath (Friday at sundown to Saturday at nightfall) for our weekly worship service. The Sabbath is the seventh day set apart by Elohim at creation (Genesis 2:2-3) and commanded in the Ten Commandments (Exodus 20:8-11). Service includes worship, Torah reading, sermon and fellowship. All are welcome.",
      date: new Date("2026-05-09"),
      time: "10:00 AM",
      location: "Nyahururu, Kenya",
      category: "worship",
      isPublished: true
    },
  ];

  let count = 0;
  for (const event of events) {
    await prisma.event.create({ data: event });
    count++;
    console.log("Added:", event.title);
  }

  console.log("\n========================================");
  console.log("SUCCESS! Added", count, "Hebrew calendar events");
  console.log("========================================");
  console.log("\nSpring Feasts:  Passover, Unleavened Bread, First Fruits, Shavuot");
  console.log("Summer:         Tisha BAv");
  console.log("Fall Feasts:    Rosh Hashanah, Yom Kippur, Sukkot, Simchat Torah");
  console.log("Winter:         Hanukkah (x2)");
  console.log("Other:          Purim, Weekly Sabbath");
}

main()
  .catch(e => { console.error("Error:", e.message); process.exit(1); })
  .finally(() => prisma.$disconnect());
