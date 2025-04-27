

const express = require('express');
const router = express.Router();
const Scene = require('../models/Scene');
const auth = require('../middleware/authMiddleware');

// Create a new scene
router.post('/', auth, async (req, res) => {
  try {
    const scene = new Scene({
      name: req.body.name,
      objects: req.body.objects,
      createdBy: req.user.id, 
      collaborators: [req.user.id]
    });

    await scene.save();
    res.status(201).json(scene);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

//Get all scenes for the logged-in user
router.get('/', auth, async (req, res) => {
  try {
    const scenes = await Scene.find({ createdBy: req.user.id });
    res.json(scenes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

//Update an existing scene
router.patch('/:id', auth, async (req, res) => {
  try {
    const scene = await Scene.findById(req.params.id);

    if (!scene) {
      return res.status(404).json({ message: 'Scene not found' });
    }

    // Optional: Only allow creator to update
    if (scene.createdBy.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // Update fields
    scene.name = req.body.name || scene.name;
    scene.objects = req.body.objects || scene.objects;

    const updatedScene = await scene.save();
    res.json(updatedScene);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Delete a scene
router.delete('/:id', auth, async (req, res) => {
  try {
    const scene = await Scene.findById(req.params.id);
    if (!scene) {
      return res.status(404).json({ error: 'Scene not found' });
    }

    // Check if the logged-in user is the creator
    if (!scene.createdBy.equals(req.user.id)) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await scene.deleteOne();
    res.json({ message: 'Scene deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
