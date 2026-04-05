const BlogPost = require("../models/BlogPost.model");

const generateSlug = (title) => {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") + "-" + Date.now();
};

exports.getPosts = async (req, res) => {
  try {
    const { category, search } = req.query;
    const query = { isPublished: true };
    if (category && category !== "all") query.category = category;
    if (search && search.trim()) {
      const term = search.trim();
      query.$or = [
        { title: { $regex: term, $options: "i" } },
        { excerpt: { $regex: term, $options: "i" } },
        { content: { $regex: term, $options: "i" } },
        { author: { $regex: term, $options: "i" } },
      ];
    }
    const posts = await BlogPost.find(query).sort({ createdAt: -1 });
    res.json({ success: true, data: posts });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.getPost = async (req, res) => {
  try {
    const post = await BlogPost.findOneAndUpdate(
      { slug: req.params.slug, isPublished: true },
      { $inc: { views: 1 } },
      { new: true }
    );
    if (!post) return res.status(404).json({ success: false, message: "Post not found" });
    res.json({ success: true, data: post });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.getFeaturedPosts = async (req, res) => {
  try {
    const posts = await BlogPost.find({ isPublished: true, isFeatured: true }).sort({ createdAt: -1 }).limit(3);
    res.json({ success: true, data: posts });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.getAllPosts = async (req, res) => {
  try {
    const posts = await BlogPost.find().sort({ createdAt: -1 });
    res.json({ success: true, data: posts });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.createPost = async (req, res) => {
  try {
    const slug = generateSlug(req.body.title);
    const post = await BlogPost.create({ ...req.body, slug, createdBy: req.user._id });
    res.status(201).json({ success: true, data: post });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.updatePost = async (req, res) => {
  try {
    const post = await BlogPost.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!post) return res.status(404).json({ success: false, message: "Post not found" });
    res.json({ success: true, data: post });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.deletePost = async (req, res) => {
  try {
    await BlogPost.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Post deleted" });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};
