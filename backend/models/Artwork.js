// models/Artwork.js
const mongoose = require('mongoose');

const artworkSchema = new mongoose.Schema({
  artistId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Artist ID is required']
  },
  title: {
    type: String,
    required: [true, 'Artwork title is required'],
    trim: true,
    minlength: [3, 'Title must be at least 3 characters long'],
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Artwork description is required'],
    trim: true,
    minlength: [10, 'Description must be at least 10 characters long'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  medium: {
    type: String,
    required: [true, 'Medium is required'],
    trim: true,
    enum: ['Oil on Canvas', 'Acrylic', 'Watercolor', 'Digital Art', 'Sculpture', 'Photography', 'Mixed Media', 'Pencil', 'Charcoal', 'Other']
  },
  style: {
    type: String,
    required: [true, 'Style is required'],
    trim: true,
    enum: ['Abstract', 'Impressionism', 'Realism', 'Surrealism', 'Contemporary', 'Modern', 'Pop Art', 'Minimalism', 'Expressionism', 'Other']
  },
  dimensions: {
    width: { type: Number, default: null },
    height: { type: Number, default: null },
    depth: { type: Number, default: null },
    unit: { 
      type: String, 
      enum: ['cm', 'inch', 'mm', 'm'],
      default: 'cm'
    }
  },
  status: {
    type: String,
    enum: ['available', 'sold', 'reserved', 'unavailable'],
    default: 'available'
  },
  tags: [{
    type: String,
    trim: true
  }],
  views: {
    type: Number,
    default: 0
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for search functionality
artworkSchema.index({ title: 'text', description: 'text', tags: 'text' });
artworkSchema.index({ medium: 1, style: 1, price: 1 });
artworkSchema.index({ artistId: 1, status: 1 });

module.exports = mongoose.model('Artwork', artworkSchema);