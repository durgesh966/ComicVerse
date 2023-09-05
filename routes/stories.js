const express = require('express');
const router = express.Router();
const { ensureAuth } = require('../middleware/auth');
const Story = require('../models/Story');

// Show add page
router.get('/add', ensureAuth, (req, res) => {
  res.render('stories/add');
});



// Process add form
router.post('/', ensureAuth, async (req, res) => {
  try {
    req.body.user = req.user.id;
    await Story.create(req.body);
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    res.render('error/500');
  }
});

// Show all stories
router.get('/', ensureAuth, async (req, res) => {
  try {
    const stories = await Story.find({ status: 'public' })
      .populate('user')
      .sort({ createdAt: 'desc' })
      .lean();
    res.render('stories/index', { stories });
  } catch (err) {
    console.error(err);
    res.render('error/500');
  }
});

// Show single story
router.get('/:id', ensureAuth, async (req, res) => {
  try {
    const story = await Story.findById(req.params.id)
      .populate('user')
      .lean();
    if (!story) {
      return res.render('error/404');
    }
    if (story.user._id != req.user.id && story.status == 'private') {
      res.render('error/404');
    } else {
      res.render('stories/show', { story });
    }
  } catch (err) {
    console.error(err);
    res.render('error/404');
  }
});

// Show edit page
router.get('/edit/:id', ensureAuth, async (req, res) => {
  try {
    const story = await Story.findOne({ _id: req.params.id }).lean();
    if (!story) {
      return res.render('error/404');
    }
    if (story.user != req.user.id) {
      return res.redirect('/stories');
    }
    res.render('stories/edit', { story });
  } catch (err) {
    console.error(err);
    res.render('error/500');
  }
});

// Update story
router.put('/:id', ensureAuth, async (req, res) => {
  try {
    const story = await Story.findById(req.params.id).lean();
    if (!story) {
      return res.render('error/404');
    }
    if (story.user != req.user.id) {
      return res.redirect('/stories');
    }
    await Story.findOneAndUpdate({ _id: req.params.id }, req.body, {
      new: true,
      runValidators: true,
    });
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    res.render('error/500');
  }
});

// Delete story
router.delete('/:id', ensureAuth, async (req, res) => {
  try {
    const story = await Story.findById(req.params.id).lean();
    if (!story) {
      return res.render('error/404');
    }
    if (story.user != req.user.id) {
      return res.redirect('/stories');
    }
    await Story.deleteOne({ _id: req.params.id });
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    res.render('error/500');
  }
});


// User stories
router.get('/user/:userId', ensureAuth, async (req, res) => {
  try {
    const stories = await Story.find({
      user: req.params.userId,
      status: 'public',
    })
      .populate('user')
      .lean();
    res.render('stories/index', { stories });
  } catch (err) {
    console.error(err);
    res.render('error/500');
  }
});

// Search stories by title
router.get('/search/:query', ensureAuth, async (req, res) => {
  try {
    const stories = await Story.find({
      title: new RegExp(req.params.query, 'i'),
      status: 'public',
    })
      .populate('user')
      .sort({ createdAt: 'desc' })
      .lean();
    res.render('stories/index', { stories });
  } catch (err) {
    console.error(err);
    res.render('error/404');
  }
});

module.exports = router;
