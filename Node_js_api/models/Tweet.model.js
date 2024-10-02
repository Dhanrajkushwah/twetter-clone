const mongoose = require('mongoose');

const tweetSchema = new mongoose.Schema({
  content: { type: String, required: true },
  mediaUrl: { type: String },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], 
  isRetweet: { type: Boolean, default: false },
  originalTweet: { type: mongoose.Schema.Types.ObjectId, ref: 'Tweet' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Tweet', tweetSchema);

