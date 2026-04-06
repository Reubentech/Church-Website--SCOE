const prisma = require("../lib/prisma");

exports.getPosts = async (req, res) => {
  try {
    const { category, search } = req.query;
    const where = { isPublished: true };
    if (category && category !== "all") where.category = category;
    if (search) where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { content: { contains: search, mode: "insensitive" } },
    ];
    const posts = await prisma.blog.findMany({ where, orderBy: { createdAt: "desc" } });
    res.json({ success: true, data: posts });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.getAllPosts = async (req, res) => {
  try {
    const posts = await prisma.blog.findMany({ orderBy: { createdAt: "desc" } });
    res.json({ success: true, data: posts });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.getPost = async (req, res) => {
  try {
    const post = await prisma.blog.findUnique({ where: { id: req.params.id } });
    if (!post) return res.status(404).json({ success: false, message: "Post not found" });
    await prisma.blog.update({ where: { id: req.params.id }, data: { views: { increment: 1 } } });
    res.json({ success: true, data: post });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.createPost = async (req, res) => {
  try {
    const { title, content, excerpt, author, category, imageUrl, isPublished } = req.body;
    const post = await prisma.blog.create({ data: { title, content, excerpt: excerpt || "", author, category: category || "news", imageUrl: imageUrl || "", isPublished: isPublished !== undefined ? Boolean(isPublished) : true, createdBy: req.user.id } });
    res.status(201).json({ success: true, data: post });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.updatePost = async (req, res) => {
  try {
    const data = { ...req.body };
    if (data.isPublished !== undefined) data.isPublished = Boolean(data.isPublished);
    delete data.createdBy;
    const post = await prisma.blog.update({ where: { id: req.params.id }, data });
    res.json({ success: true, data: post });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.deletePost = async (req, res) => {
  try {
    await prisma.blog.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: "Post deleted" });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};
