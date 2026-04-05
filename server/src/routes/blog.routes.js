const express = require("express");
const router = express.Router();
const { getPosts, getAllPosts, getPost, createPost, updatePost, deletePost } = require("../controllers/blog.controller");
const { protect, adminOnly } = require("../middleware/auth.middleware");

router.get("/", getPosts);
router.get("/all", protect, adminOnly, getAllPosts);
router.get("/:id", getPost);
router.post("/", protect, adminOnly, createPost);
router.put("/:id", protect, adminOnly, updatePost);
router.delete("/:id", protect, adminOnly, deletePost);

module.exports = router;
