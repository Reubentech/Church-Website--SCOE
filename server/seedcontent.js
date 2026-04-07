const { PrismaClient } = require("@prisma/client");
require("dotenv").config();

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding blog posts, bulletins, and bible studies...");

  // ─── BLOG POSTS ──────────────────────────────────────────────────────────────
  const blogPosts = [
    {
      title: "The Seventh Day Rest: Understanding the Sabbath Command",
      slug: "seventh-day-rest-understanding-sabbath",
      excerpt: "The Sabbath is not a suggestion — it is the fourth commandment, a weekly covenant sign between Elohim and His people.",
      content: `The Sabbath is one of the most misunderstood and neglected commandments in modern Christianity. Yet it stands as the fourth of the Ten Commandments, given directly by Elohim at Mount Sinai and repeated throughout Scripture.

Exodus 20:8-10 declares: "Remember the Sabbath day, to keep it holy. Six days you shall labor and do all your work, but the seventh day is the Sabbath of the LORD your God."

The word "Sabbath" comes from the Hebrew word Shabbat, meaning to rest or to cease. From the very first week of creation, Elohim modeled this rhythm of work and rest. Genesis 2:2-3 tells us He rested on the seventh day and blessed it, setting it apart as holy.

Why does the Sabbath matter? Because it is a sign of the covenant — a reminder that Elohim is our Creator and Redeemer. Ezekiel 20:12 says: "Moreover I also gave them My Sabbaths, to be a sign between them and Me, that they might know that I am the LORD who sanctifies them."

When we observe the Sabbath, we are declaring our trust in Elohim as our provider. We cease our own striving and enter into His rest. It is an act of faith, worship, and obedience.

Observing the Sabbath does not earn salvation — salvation is by grace through faith. But the Sabbath is a gift from Elohim, an invitation to draw near to Him one day each week, free from the pressures of work and the distractions of the world.

Let us receive this gift with joy and keep it holy, as Elohim has commanded.`,
      category: "teaching",
      author: "Pastor James Kariuki",
      tags: ["sabbath", "commandments", "rest", "covenant"],
      isFeatured: true,
      isPublished: true,
      views: 124,
    },
    {
      title: "My Journey to the Sabbath: How Elohim Led Me to the Truth",
      slug: "my-journey-to-the-sabbath-testimony",
      excerpt: "I grew up observing Sunday as the holy day. But one study changed everything — and I have never looked back.",
      content: `For thirty years I worshipped every Sunday without question. It was what my family did, what my church taught, and I never thought to ask why.

Then in 2019, a colleague handed me a booklet about the Sabbath. I almost threw it away. But something in me said: read it. That night, I opened my Bible and began to search.

I found that from Genesis to Revelation, the seventh day — what we call Saturday — is consistently identified as the Sabbath. I found that Yahushua (Jesus) kept the Sabbath. His disciples kept it. The early believers kept it for centuries after the resurrection.

I brought my questions to my pastor. He could not answer them from Scripture. He pointed me to tradition and church history. But I needed a word from Elohim, not from men.

After months of prayer, study, and wrestling with Elohim, I made the decision to honor the seventh-day Sabbath. It cost me friendships and created tension in my family. But the peace I found in obedience was unlike anything I had ever experienced.

Today, Sabbath is the highlight of my week. From sunset Friday to sunset Saturday, I put away work, screens, and busyness. I pray, I study the Word, I fellowship with believers, and I rest in the arms of my Creator.

If you are searching for truth, I encourage you: open your Bible and study the Sabbath for yourself. Elohim will not let you walk in darkness if you sincerely seek Him.`,
      category: "testimony",
      author: "Sister Grace Njeri",
      tags: ["testimony", "sabbath", "truth", "faith"],
      isFeatured: false,
      isPublished: true,
      views: 87,
    },
    {
      title: "The Feasts of Elohim: His Sacred Calendar for His People",
      slug: "feasts-of-elohim-sacred-calendar",
      excerpt: "The seven biblical feasts are not merely Jewish holidays — they are appointments on Elohim's calendar with profound prophetic meaning.",
      content: `Leviticus 23 records seven annual appointed times — moedim in Hebrew — that Elohim commanded His people to observe. These are not the feasts of Israel or the feasts of the Jews. Scripture calls them "the feasts of the LORD" (Leviticus 23:2).

Each feast is a rehearsal of redemption. Together they tell the full story of salvation.

THE SPRING FEASTS

Passover (Pesach) commemorates the redemption from Egypt and foreshadowed the sacrifice of the Messiah, our Passover Lamb (1 Corinthians 5:7).

Unleavened Bread (Chag HaMatzot) follows immediately, calling us to remove sin (leaven) from our lives. The Messiah's sinless body was in the tomb during this feast.

Firstfruits (Yom HaBikkurim) is when the first of the harvest was offered to Elohim. The Messiah rose from the dead on Firstfruits (1 Corinthians 15:20-23).

Weeks (Shavuot / Pentecost) came fifty days after Firstfruits. It was on this day that Elohim gave the Torah at Sinai, and centuries later, the Holy Spirit was poured out on the disciples (Acts 2).

THE FALL FEASTS

Trumpets (Yom Teruah) is a day of blowing the shofar — a call to awakening and repentance. Many believe this foreshadows the return of the Messiah.

Day of Atonement (Yom Kippur) is the most solemn day of the year — a day of fasting, repentance, and drawing near to Elohim. It points to the final judgment and atonement.

Tabernacles (Sukkot) is a joyful feast of harvest and dwelling in temporary shelters, remembering Elohim's provision in the wilderness. It points to the Messiah dwelling among us in the Kingdom.

These feasts are Elohim's calendar. They reveal His plan of redemption from beginning to end. To ignore them is to miss a beautiful dimension of His Word.`,
      category: "teaching",
      author: "Elder Moses Kamau",
      tags: ["feasts", "torah", "prophecy", "calendar", "passover"],
      isFeatured: true,
      isPublished: true,
      views: 203,
    },
    {
      title: "Walking in Holiness: Practical Steps for Daily Sanctification",
      slug: "walking-in-holiness-practical-steps",
      excerpt: "Holiness is not a one-time event — it is a daily walk of surrender, obedience, and transformation by the Spirit of Elohim.",
      content: `"Be holy, for I am holy" — this command appears repeatedly throughout Scripture (Leviticus 11:44, 1 Peter 1:16). But what does holiness look like in daily life?

Holiness begins with a renewed mind. Romans 12:2 tells us: "Do not be conformed to this world, but be transformed by the renewing of your mind." Every day, we choose what we fill our minds with. The Word of Elohim must be our primary input.

PRACTICAL STEPS TO DAILY HOLINESS

1. Begin every day in prayer. Before the noise of the world enters your mind, present yourself to Elohim. Ask Him to guide your words, thoughts, and actions throughout the day.

2. Read the Scripture daily. Even fifteen minutes of focused Bible reading will transform you over time. Start with the Psalms for worship, the Proverbs for wisdom, and the Gospels for the life of the Messiah.

3. Guard your speech. Proverbs 18:21 says the tongue has the power of life and death. Speak words of encouragement, truth, and faith. Refuse gossip, slander, and profanity.

4. Flee temptation. Joseph ran from Potiphar's wife. We are told to flee youthful lusts (2 Timothy 2:22). Know your weaknesses and make no provision for the flesh.

5. Forgive quickly. Unforgiveness is a poison that destroys the one who holds it. Release others as Elohim has released you.

6. Fellowship with believers. We are sharpened by our brothers and sisters in faith (Proverbs 27:17). Do not neglect the gathering together of the saints.

7. End each day with thanksgiving and reflection. Ask Elohim to reveal any area that needs correction, and surrender it to Him.

Holiness is not perfection — it is direction. It is the daily commitment to walk with Elohim, choosing His ways over our own.`,
      category: "devotional",
      author: "Pastor James Kariuki",
      tags: ["holiness", "sanctification", "discipleship", "prayer"],
      isFeatured: false,
      isPublished: true,
      views: 56,
    },
    {
      title: "Community Outreach: Serving Nyahururu in the Name of Elohim",
      slug: "community-outreach-serving-nyahururu",
      excerpt: "Our congregation recently completed a community outreach program in Nyahururu — here is what Elohim did through willing hands and hearts.",
      content: `On March 15, 2026, members of the Sabbathtarian Church of Elohim gathered at dawn for one purpose: to serve our community in the name of Elohim.

Forty-two volunteers, including youth, adults, and elders, set out across the Nyahururu area. We visited three children's homes, two elderly care centers, and distributed food parcels to over 150 families in need.

At the Nyahururu Children's Home, we brought clothes, books, and food supplies. The children gathered around and one of our youth teams led them in songs of praise. Many of the staff members were moved to tears.

At Kiplangat Elderly Care Center, our women's ministry team cooked a full meal and sat with the residents for over two hours — listening to their stories, praying with them, and singing hymns. Sister Ruth Wanjiku led a short devotional that left several residents requesting to know more about our faith.

The food parcel distribution in Kianjogu Estate reached families who had not had a proper meal in days. We did not ask for anything in return. We simply said: "Elohim loves you. So do we."

This is the kind of church we want to be. Not one that only gathers within its walls, but one that goes out into the community as the hands and feet of the Messiah.

Isaiah 58:6-7 calls us to share our bread with the hungry and bring the homeless poor into our house. We are committed to this kind of faith — not just words, but deeds.

Our next outreach is scheduled for June 20, 2026. All members are invited to participate. Sign up at the church office or speak to Brother David Muthoni.`,
      category: "news",
      author: "Church Administration",
      tags: ["outreach", "community", "service", "missions"],
      isFeatured: false,
      isPublished: true,
      views: 41,
    },
  ];

  for (const post of blogPosts) {
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: post,
      create: post,
    });
    console.log("BlogPost:", post.title);
  }

  // ─── BULLETINS ───────────────────────────────────────────────────────────────
  await prisma.bulletin.deleteMany({});

  const bulletins = [
    {
      title: "Sabbath Bulletin — April 5, 2026",
      week: "Week of April 5, 2026",
      date: new Date("2026-04-05"),
      content: "Shabbat Shalom, beloved family of Elohim! Welcome to our Sabbath worship service. We are grateful for each of you who has gathered to honor the Lord on His holy day. May this Sabbath bring rest, renewal, and revelation to your heart.",
      scripture: "Isaiah 58:13-14 — \"If you turn away your foot from the Sabbath, from doing your pleasure on My holy day, and call the Sabbath a delight, the holy day of the LORD honorable, and shall honor Him, not doing your own ways, nor finding your own pleasure, nor speaking your own words, then you shall delight yourself in the LORD.\"",
      announcements: [
        "Wednesday Bible Study continues at 6:00 PM in the main hall — this week: The Armor of Elohim (Ephesians 6)",
        "Youth meeting this Saturday at 3:00 PM — Topic: Purity and Purpose in the Modern World",
        "Community outreach program on June 20, 2026 — sign up at the church office",
        "Tithes and offerings: M-Pesa Paybill 400200, Account: CHURCH",
        "New members orientation begins April 26 — speak to Elder Moses Kamau to register",
        "Choir rehearsal every Thursday at 5:30 PM — new members welcome",
      ],
      isPublished: true,
    },
    {
      title: "Sabbath Bulletin — March 29, 2026",
      week: "Week of March 29, 2026",
      date: new Date("2026-03-29"),
      content: "Shabbat Shalom! This Sabbath we continue our series on the Feasts of Elohim. Today's message will focus on Passover and its fulfillment in the Messiah. We invite you to open your hearts and receive the Word of Elohim as it is proclaimed today.",
      scripture: "Exodus 12:13 — \"Now the blood shall be a sign for you on the houses where you are. And when I see the blood, I will pass over you; and the plague shall not be on you to destroy you when I strike the land of Egypt.\"",
      announcements: [
        "Passover observance service on April 12 at sunset — all members are strongly encouraged to attend",
        "Unleavened Bread week begins April 13 — teaching materials available at the welcome desk",
        "Prayer and fasting day on April 18 from 6 AM to 6 PM — join us in the main sanctuary",
        "Sister Grace Njeri's new baby dedication will take place on April 19 — all welcome",
        "Donations for the children's home outreach are being received — see Brother David",
        "Church library is now open every Sabbath after service — over 200 books available",
      ],
      isPublished: true,
    },
    {
      title: "Sabbath Bulletin — March 22, 2026",
      week: "Week of March 22, 2026",
      date: new Date("2026-03-22"),
      content: "Shabbat Shalom, dear family! Welcome to the house of Elohim. Today we begin a new teaching series: \"Back to the Foundations\" — exploring the foundational truths of our faith from the Torah. We believe that a return to these foundations will bring strength, unity, and blessing to our congregation.",
      scripture: "Deuteronomy 6:4-5 — \"Hear, O Israel: The LORD our God, the LORD is one! You shall love the LORD your God with all your heart, with all your soul, and with all your strength.\"",
      announcements: [
        "\"Back to the Foundations\" teaching series begins today — special notes available at the welcome desk",
        "Men's fellowship breakfast on April 4 at 8:00 AM — all men invited, bring a friend",
        "Women's prayer group meets every Tuesday at 7:00 AM in the prayer room",
        "Congratulations to Brother Samuel and Sister Lydia on their marriage last Sabbath!",
        "The church van is available for pickup — contact the office if you need a ride to Sabbath services",
        "Annual church elections will be held on May 30 — interested candidates should submit names by May 10",
      ],
      isPublished: true,
    },
  ];

  await prisma.bulletin.createMany({ data: bulletins });
  console.log("Bulletins: 3 created");

  // ─── BIBLE STUDIES ───────────────────────────────────────────────────────────
  await prisma.bibleStudy.deleteMany({});

  const bibleStudies = [
    {
      title: "The Armor of Elohim: Standing Firm in Spiritual Battle",
      week: "April 2, 2026",
      scripture: "Ephesians 6:10-18",
      author: "Pastor James Kariuki",
      content: `INTRODUCTION

The apostle Paul wrote Ephesians 6:10-18 from a Roman prison, surrounded by soldiers in full military armor. Inspired by the Holy Spirit, he used the image of that armor to teach us how to stand against the enemy of our souls.

We are in a spiritual war. Ephesians 6:12 reminds us: "We do not wrestle against flesh and blood, but against principalities, against powers, against the rulers of the darkness of this age, against spiritual hosts of wickedness in the heavenly places."

THE SIX PIECES OF ARMOR

1. THE BELT OF TRUTH (v.14)
A Roman soldier's belt held the rest of the armor together. Truth is the foundation of our spiritual life. Without truth, everything falls apart. We must know the Word of Elohim and walk in honesty and integrity.

Study question: In what areas of your life are you struggling to walk in complete truth?

2. THE BREASTPLATE OF RIGHTEOUSNESS (v.14)
The breastplate protected the vital organs — the heart. Righteousness protects our hearts from the accusations and condemnation of the enemy. This is both the imputed righteousness of the Messiah and our practical righteousness in daily living.

Study question: How does living righteously protect your heart from spiritual attack?

3. THE SHOES OF PEACE (v.15)
Roman soldiers wore hobnailed sandals for firm footing. We are to stand firm on the gospel of peace. Peace with Elohim through the Messiah gives us stability in the storms of life.

Study question: How does the peace of Elohim help you stand firm when circumstances are chaotic?

4. THE SHIELD OF FAITH (v.16)
The Roman shield was large enough to crouch behind. Faith in Elohim extinguishes the fiery darts of doubt, fear, temptation, and accusation that the enemy fires at us. Faith is active trust in Elohim's Word and character.

Study question: What "fiery darts" does the enemy most frequently launch against you?

5. THE HELMET OF SALVATION (v.17)
The mind is the primary battlefield. The helmet of salvation protects our thinking with the assurance of our redemption. When we know we are saved, we can resist the enemy's lies about our identity and standing before Elohim.

Study question: How does the assurance of salvation change the way you think during trials?

6. THE SWORD OF THE SPIRIT (v.17)
This is the only offensive weapon in the list — the Word of Elohim. When the Messiah was tempted in the wilderness, He responded each time with "It is written." We must know the Scripture to use it effectively in spiritual warfare.

Study question: What scriptures have you memorized that you can use against temptation?

PRAYER (v.18)
All of this armor is put on and maintained through prayer. Paul calls us to pray in the Spirit at all times, with all kinds of prayer and supplication. Prayer is the atmosphere in which spiritual warfare is conducted.

APPLICATION
- Put on the full armor daily through prayer and the Word
- Identify which piece of armor you most neglect
- Memorize one verse from Ephesians 6:10-18 this week
- Pray for a brother or sister in the congregation who is in spiritual battle`,
      isPublished: true,
    },
    {
      title: "The Names of Elohim: Knowing Him by His Character",
      week: "March 26, 2026",
      scripture: "Exodus 3:13-15; Psalm 91:1-2",
      author: "Elder Moses Kamau",
      content: `INTRODUCTION

In ancient Hebrew culture, a name was not merely a label — it was a declaration of character, nature, and identity. When Elohim reveals His names in Scripture, He is revealing Himself to us.

Studying the names of Elohim is one of the most enriching exercises a believer can undertake. Each name opens a window into the character of our Creator, Redeemer, and King.

THE FOUNDATIONAL NAME

YHWH (Yahweh) — The Self-Existent One
Exodus 3:14: "I AM WHO I AM." This is the most sacred name of Elohim, representing His eternal, self-existent nature. He is not dependent on anything outside Himself. He simply IS. This name appears over 6,800 times in the Hebrew Scriptures.

Study question: What does it mean to you personally that Elohim is self-existent and eternal?

THE COMPOUND NAMES OF YHWH

Each of these names was revealed in a specific historical moment, showing that Elohim meets His people exactly where they are.

YHWH-Yireh — The LORD Will Provide (Genesis 22:14)
Revealed when Elohim provided a ram for Abraham on Mount Moriah. He is our Provider in every area of life — financial, emotional, spiritual, relational.

YHWH-Rapha — The LORD Who Heals (Exodus 15:26)
After crossing the Red Sea, Elohim declared: "I am the LORD who heals you." He heals bodies, minds, relationships, and nations.

YHWH-Nissi — The LORD My Banner (Exodus 17:15)
After the victory over the Amalekites, Moses built an altar and called it "The LORD Is My Banner." Elohim is our victory. We fight under His banner.

YHWH-Shalom — The LORD Is Peace (Judges 6:24)
Revealed to Gideon when he was afraid. Elohim's peace surpasses understanding and guards our hearts (Philippians 4:7).

YHWH-Raah — The LORD My Shepherd (Psalm 23:1)
David, who was himself a shepherd, recognized Elohim as his Shepherd. He leads, provides, protects, and restores.

YHWH-Tsidkenu — The LORD Our Righteousness (Jeremiah 23:6)
Foretelling the coming Messiah, Jeremiah prophesied that He would be called "The LORD Our Righteousness." Our righteousness is not our own — it is in Him.

YHWH-Shammah — The LORD Is There (Ezekiel 48:35)
The name given to the restored city of Jerusalem: "The LORD Is There." This is the promise of His presence — He will dwell with His people forever.

El ELYON — God Most High (Genesis 14:18-20)
Elohim is sovereign over all kingdoms, nations, and powers. No authority exists apart from His permission.

El SHADDAI — God Almighty / God of the Mountain (Genesis 17:1)
The name revealed to Abraham when he was ninety-nine years old. Nothing is impossible for the Almighty.

APPLICATION
- Choose one name of Elohim that speaks to your current situation
- Meditate on a scripture connected to that name throughout the week
- In your prayer time, address Elohim by the name that reflects what you need from Him
- Share with a family member or friend what you learned about one of His names`,
      isPublished: true,
    },
    {
      title: "The Covenants of Scripture: Elohim's Unfolding Plan of Redemption",
      week: "March 19, 2026",
      scripture: "Genesis 15:18; Hebrews 8:6-13",
      author: "Pastor James Kariuki",
      content: `INTRODUCTION

A covenant is a solemn, binding agreement between two parties. Throughout Scripture, Elohim initiates covenants with His people — each one revealing more of His redemptive plan and bringing us closer to the fullness of His Kingdom.

Understanding the covenants is essential to reading the Bible correctly. Every promise, prophecy, law, and gospel proclamation exists within the framework of one or more covenants.

THE MAJOR COVENANTS

1. THE COVENANT WITH NOAH (Genesis 9:8-17)
After the flood, Elohim established a covenant with Noah and all creation. He promised never again to destroy the earth by flood, sealing it with the rainbow as a sign. This covenant demonstrates Elohim's commitment to sustain life and creation.

Key truth: Elohim is faithful to His creation.

Study question: What does the Noahic covenant reveal about Elohim's character?

2. THE COVENANT WITH ABRAHAM (Genesis 12; 15; 17)
This is the foundational covenant of redemption. Elohim promised Abraham:
- Land (Canaan, and ultimately the whole earth)
- Seed (a great nation, and ultimately the Messiah)
- Blessing (all families of the earth would be blessed through him)

Elohim sealed this covenant by passing between the pieces of the sacrifice Himself — taking both sides of the oath. This means the covenant depended entirely on Elohim, not on Abraham.

Galatians 3:29 tells us that in the Messiah, we are Abraham's offspring and heirs according to the promise.

Key truth: Elohim's grace is unconditional.

Study question: How are you personally an inheritor of the promises made to Abraham?

3. THE COVENANT WITH MOSES / THE TORAH COVENANT (Exodus 19-24)
At Mount Sinai, Elohim entered into a national covenant with the children of Israel. He gave them the Torah — His instructions for holy living — and called them to be a kingdom of priests and a holy nation.

This covenant was conditional: blessings for obedience, curses for disobedience (Deuteronomy 28). The people promised to obey, but repeatedly broke the covenant through idolatry and rebellion.

Key truth: The Torah reveals Elohim's holy standard and our need for a Savior.

Study question: If Israel kept breaking the covenant, what does this reveal about human nature?

4. THE COVENANT WITH DAVID (2 Samuel 7:8-16)
Elohim promised David that his throne and kingdom would be established forever. One of his descendants would sit on the throne forever. This was ultimately fulfilled in the Messiah Yahushua, who is the Son of David, King of Kings.

Key truth: Elohim's kingdom will never end.

Study question: How does the Davidic covenant give us hope for the future?

5. THE NEW COVENANT (Jeremiah 31:31-34; Hebrews 8:6-13)
Jeremiah prophesied a coming day when Elohim would make a new covenant — not written on stone tablets but on human hearts. This covenant would bring forgiveness of sins and an intimate knowledge of Elohim for all people.

This New Covenant was inaugurated by the Messiah at the Last Supper (Luke 22:20). Through His blood, we receive forgiveness of sin, the indwelling Holy Spirit, and direct access to the Father.

The New Covenant does not abolish the Torah — it fulfills it and writes it on our hearts (Matthew 5:17-18; Hebrews 8:10).

Key truth: Elohim's ultimate desire is relationship — to be our Elohim and for us to be His people.

THE UNITY OF THE COVENANTS
These covenants are not contradictory — they are progressive. Each one builds on the previous, unfolding Elohim's plan of redemption like a flower opening petal by petal.

The scarlet thread of redemption runs from Genesis to Revelation: Elohim pursuing His people, making a way for us to return to Him, and ultimately dwelling with us forever.

APPLICATION
- Identify which covenant is hardest for you to understand and commit to studying it this week
- Read Hebrews 8-10 for a full explanation of the New Covenant and its relationship to the Old
- Reflect: In what ways has Elohim been faithful to His covenant with you personally?
- Write down three promises from the covenants that apply to your life today`,
      isPublished: true,
    },
  ];

  await prisma.bibleStudy.createMany({ data: bibleStudies });
  console.log("Bible Studies: 3 created");

  console.log("\nAll content seeded successfully!");
  process.exit(0);
}

main().catch(e => { console.error(e.message); process.exit(1); });
