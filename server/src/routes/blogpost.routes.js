const express = require("express");
const router = express.Router();
const { getPosts, getPost, getFeaturedPosts, getAllPosts, createPost, updatePost, deletePost } = require("../controllers/blogpost.controller");
const { protect, adminOnly } = require("../middleware/auth.middleware");

router.get("/", getPosts);
router.get("/featured", getFeaturedPosts);
router.get("/all", protect, adminOnly, getAllPosts);
router.get("/:slug", getPost);
router.post("/", protect, adminOnly, createPost);
router.put("/:id", protect, adminOnly, updatePost);
router.delete("/:id", protect, adminOnly, deletePost);

module.exports = router;
