// user.controller.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User.model');
const Tweet = require('../models/Tweet.model');
const Message = require('../models/Message.model');
const secretKey = 'supersecretkey'; // Move to environment variable in production
const mongoose = require('mongoose');

// Get all users
const getUsers = async (req, res) => {
    const users = await User.find();
    res.json(users);
};

// Get user by ID
const getUser = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send('Invalid user ID');
    }

    try {
        const user = await User.findById(id)
            .populate('followers', 'username email') // Populate followers with username
            .populate('following', 'username email'); // Populate following with username

        if (!user) {
            return res.status(404).send('User not found');
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).send('Server error');
    }
};



const getUserTweets = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid user ID' });
    }

    try {
        const tweets = await Tweet.find({ author: id }).populate('author');
        res.json(tweets);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
// Create user
const createUser = async (req, res) => {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({ username, email, password: hashedPassword });
    await user.save();
    res.status(201).json(user);
};

// User login
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User does not exist' });

    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) return res.status(401).json({ message: 'Password is incorrect' });

    const token = jwt.sign({ userId: user.id, email: user.email }, secretKey, { expiresIn: '1h' });
    res.json({ userId: user.id, token, tokenExpiration: 1 });
};

// Create a tweet
// Create a tweet
const createTweet = async (req, res) => {
    const { content, mediaUrl } = req.body;

    // Validate request body
    if (!content || typeof content !== 'string') {
        return res.status(400).json({ message: 'Content is required and should be a string' });
    }

    const author = req.userId;

    try {
        const tweet = new Tweet({ content, mediaUrl, author });
        await tweet.save();
        res.status(201).json(tweet);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};


const likeTweet = async (req, res) => {
    const userId = req.userId; // Extract the user's ID from the token

    try {
        const tweet = await Tweet.findById(req.params.id);

        if (!tweet) {
            return res.status(404).json({ message: 'Tweet not found' });
        }

        if (tweet.likes.includes(userId)) {
            return res.status(400).json({ message: 'Tweet already liked' });
        }

        tweet.likes.push(userId); // Add user's ID to the likes array
        await tweet.save();

        res.status(200).json(tweet); // Return updated tweet
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};


// Get all tweets
const getTweets = async (req, res) => {
    const tweets = await Tweet.find().populate('author');
    res.json(tweets);
};

// Delete a tweet
const deleteTweet = async (req, res) => {
    const userId = req.userId; // Extract user ID from token
  
    try {
      const tweet = await Tweet.findById(req.params.id);
  
      // Check if the tweet exists
      if (!tweet) {
        return res.status(404).json({ message: 'Tweet not found' });
      }
  
      // Ensure the user requesting the deletion is the author of the tweet
      if (tweet.author.toString() !== userId) {
        return res.status(403).json({ message: 'You are not authorized to delete this tweet' });
      }
  
      // Delete the tweet
      await tweet.remove();
      res.status(200).json({ message: 'Tweet deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  };
  
// Retweet a tweet
const retweetTweet = async (req, res) => {
    const { id } = req.params;
    const userId = req.userId;

    try {
        const originalTweet = await Tweet.findById(id);
        if (!originalTweet) {
            return res.status(404).json({ message: 'Tweet not found' });
        }

        const retweet = new Tweet({
            content: originalTweet.content,
            mediaUrl: originalTweet.mediaUrl,
            author: userId,
            retweetOf: originalTweet._id  // Mark this tweet as a retweet of the original
        });

        await retweet.save();
        res.status(201).json(retweet);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

  
// Send a message
const sendMessage = async (req, res) => {
    const { content } = req.body;
    const sender = req.userId;
    const message = new Message({ content, sender });
    await message.save();
    res.status(201).json(message);
};

// Get all messages
const getMessages = async (req, res) => {
    const messages = await Message.find().populate('sender');
    res.json(messages);
};

// Follow a user
const followUser = async (req, res) => {
    try {
        const followUserId = req.body.followUserId;
        const userId = req.userId;

        if (userId === followUserId) {
            return res.status(400).json({ message: "You cannot follow yourself" });
        }

        const user = await User.findById(userId);
        const followUser = await User.findById(followUserId);

        if (!user || !followUser) {
            return res.status(404).json({ message: "User not found" });
        }

        // Avoid duplication by checking the arrays before adding
        if (!user.following.includes(followUserId)) {
            user.following.push(followUserId);
        }

        if (!followUser.followers.includes(userId)) {
            followUser.followers.push(userId);
        }

        await user.save();
        await followUser.save();
        r

        res.status(200).json({ message: "User followed successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to follow user", error });
    }
};

// Unfollow a user
const unfollowUser = async (req, res) => {
    const { followerId, unfollowUserId } = req.body;
  
    if (!mongoose.Types.ObjectId.isValid(followerId) || !mongoose.Types.ObjectId.isValid(unfollowUserId)) {
      return res.status(400).json({ message: 'Invalid IDs' });
    }
  
    try {
      // Remove the following user from the follower's 'following' list
      await User.findByIdAndUpdate(followerId, { $pull: { following: unfollowUserId } });
  
      // Remove the follower from the unfollowed user's 'followers' list
      await User.findByIdAndUpdate(unfollowUserId, { $pull: { followers: followerId } });
  
      res.status(200).json({ message: 'Successfully unfollowed the user' });
    } catch (error) {
      res.status(500).json({ message: 'Error unfollowing the user', error });
    }
  };
  

// Fetch followers
const getFollowers = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId).populate('followers', 'username email')

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ followers: user.followers });
    } catch (error) {
        res.status(500).json({ message: 'Failed to get followers', error });
    }
};



// Fetch following
const getFollowing = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId).populate('followers', 'username email')

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ following: user.following });
    } catch (error) {
        res.status(500).json({ message: 'Failed to get following', error });
    }
};

module.exports = {
    getUsers,
    getUser,
    getUserTweets,
    createUser,
    loginUser,
    createTweet,
    likeTweet,
    getTweets,
    deleteTweet,
    retweetTweet,
    sendMessage,
    getMessages,
    followUser,
    unfollowUser,
    getFollowers,
    getFollowing,
};
