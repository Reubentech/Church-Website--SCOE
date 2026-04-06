const prisma = require("../lib/prisma");

const generateSlug = (title) =>
  title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") + "-" + Date.now();

exports.getPosts = async (req, res) => {
  try {
    const { category, search } = req.query;
    const where = { isPublished: true };
    if (category && category !== "all") where.category = category;
    if (search && search.trim()) {
      where.OR = [
        { title: { contains: search.trim(), mode: "insensitive" } },
        { excerpt: { contains: search.trim(), mode: "insensitive" } },
        { content: { contains: search.trim(), mode: "insensitive" } },
        { author: { contains: search.trim(), mode: "insensitive" } },
      ];
    }
    const posts = await prisma.blogPost.findMany({ where, orderBy: { createdAt: "desc" } });
    res.json({ success: true, data: posts });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.getPost = async (req, res) => {
  try {
    const post = await prisma.blogPost.findFirst({ where: { slug: req.params.slug, isPublished: true } });
    if (!post) return res.status(404).json({ success: false, message: "Post not found" });
    await prisma.blogPost.update({ where: { id: post.id }, data: { views: { increment: 1 } } });
    res.json({ success: true, data: { ...post, views: post.views + 1 } });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.getFeaturedPosts = async (req, res) => {
  try {
    const posts = await prisma.blogPost.findMany({ where: { isPublished: true, isFeatured: true }, orderBy: { createdAt: "desc" }, take: 3 });
    res.json({ success: true, data: posts });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.getAllPosts = async (req, res) => {
  try {
    const posts = await prisma.blogPost.findMany({ orderBy: { createdAt: "desc" } });
    res.json({ success: true, data: posts });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.createPost = async (req, res) => {
  try {
    const { title, excerpt, content, category, author, thumbnail, tags, isPublished, isFeatured } = req.body;
    const slug = generateSlug(title);
    const post = await prisma.blogPost.create({ data: { title, slug, excerpt, content, category: category || "news", author, thumbnail: thumbnail || "", tags: Array.isArray(tags) ? tags : (tags ? tags.split(",").map(t => t.trim()) : []), isPublished: isPublished !== undefined ? Boolean(isPublished) : true, isFeatured: Boolean(isFeatured), createdBy: req.user.id } });
    res.status(201).json({ success: true, data: post });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.updatePost = async (req, res) => {
  try {
    const data = { ...req.body };
    if (data.isPublished !== undefined) data.isPublished = Boolean(data.isPublished);
    if (data.isFeatured !== undefined) data.isFeatured = Boolean(data.isFeatured);
    if (data.tags && !Array.isArray(data.tags)) data.tags = data.tags.split(",").map(t => t.trim());
    delete data.createdBy;
    const post = await prisma.blogPost.update({ where: { id: req.params.id }, data });
    res.json({ success: true, data: post });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.deletePost = async (req, res) => {
  try {
    await prisma.blogPost.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: "Post deleted" });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};
