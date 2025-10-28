


// models/Analytics.js
const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  artistId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Artist ID is required']
  },
  artworkId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Artwork',
    default: null
  },
  eventType: {
    type: String,
    enum: ['view', 'like', 'purchase', 'share', 'inquiry'],
    required: [true, 'Event type is required']
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: { createdAt: true, updatedAt: false }
});

// Index for analytics queries
analyticsSchema.index({ artistId: 1, createdAt: -1 });
analyticsSchema.index({ artworkId: 1, eventType: 1 });

module.exports = mongoose.model('Analytics', analyticsSchema);