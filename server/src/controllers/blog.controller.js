const Blog = require("../models/Blog.model");

exports.getPosts = async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = { isPublished: true };
    if (category && category !== "all") query.category = category;
    if (search) query.$or = [{ title: { $regex: search, $options: "i" } }, { content: { $regex: search, $options: "i" } }];
    const posts = await Blog.find(query).sort({ createdAt: -1 });
    res.json({ success: true, data: posts });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Blog.find().sort({ createdAt: -1 });
    res.json({ success: true, data: posts });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.getPost = async (req, res) => {
  try {
    const post = await Blog.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: "Post not found" });
    await Blog.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });
    res.json({ success: true, data: post });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.createPost = async (req, res) => {
  try {
    const post = await Blog.create({ ...req.body, createdBy: req.user._id });
    res.status(201).json({ success: true, data: post });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.updatePost = async (req, res) => {
  try {
    const post = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!post) return res.status(404).json({ success: false, message: "Post not found" });
    res.json({ success: true, data: post });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.deletePost = async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Post deleted" });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};
