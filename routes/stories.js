const express = require("express");
const router = express.Router();
const { ensureAuth } = require("../middleware/auth");
const Story = require("../models/Story");

// Add Story - GET /stories/add
router.get("/add", ensureAuth, (req, res) => {
  res.render("stories/add");
});

//Process add form - POST /stories
router.post("/", ensureAuth, async (req, res) => {
  try {
    req.body.user = req.user.id;
    await Story.create(req.body);
    res.redirect("/dashboard");
  } catch (error) {
    console.log(error);
    res.render("error/500");
  }
});

//Show all stories - GET /stories
router.get("/", ensureAuth, async (req, res) => {
  try {
    const stories = await Story.find({ status: "public" })
      .populate("user")
      .sort({ createdAt: "desc" })
      .lean();

    res.render("stories/index", {stories} );
  } catch (error) {
    console.log(error);
    res.render("error/500");
  }
});

// Edit Story - GET /stories/edit/:id
router.get("/edit/:id", ensureAuth, async (req, res) => {
  const story = await Story.findOne({
    _id: req.params.id
  }).lean()

  if(!story) {
    return res.render('error/404')
  }
  if (story.user != req.user.id) {
    res.redirect('/stories')
  } else {
    res.render('stories/edit', {
      story
    })
  }
});

module.exports = router;
