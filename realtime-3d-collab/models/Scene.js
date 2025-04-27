const mongoose = require('mongoose');

const SceneSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    objects: [
      {
        id: {
          type: String,
          required: true,
        },
        type: {
          type: String,
          required: true,
        },
        x: {
          type: Number,
          required: true,
        },
        y: {
          type: Number,
          required: true,
        },
        z: {
          type: Number,
          required: true,
        }
      }
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Scene', SceneSchema);
