const express = require('express');
const { 
    getUsers, 
    getUser, 
    getUserTweets,
    createUser, 
    loginUser, 
    createTweet, 
    likeTweet,
    getTweets, 
    deleteTweet, 
    sendMessage, 
    getMessages, 
    followUser,
    getFollowers,
    getFollowing,

} = require('../controllers/user.controller');

const checkAuth = require('../middleware'); // Ensure this is the correct path
const router = express.Router();

// Example route
router.get('/protected', checkAuth, (req, res) => {
    res.json({ message: 'This is a protected route.', userId: req.userId });
});

// User routes
router.get('/users', getUsers);
router.get('/users/:id', getUser); 
router.get('/tweets/:id', getUserTweets);
router.post('/users', createUser);
router.post('/login', loginUser);

// Tweet routes
router.post('/tweets', checkAuth, createTweet);
router.get('/tweets', getTweets);
router.delete('/tweets/:id', checkAuth, deleteTweet);
router.post('/tweets/:id/like', checkAuth, likeTweet);

// Message routes
router.post('/messages', checkAuth, sendMessage);
router.get('/messages', checkAuth, getMessages);

// Follow user route
router.post('/follow', checkAuth, followUser);

// Fetch followers and following
router.get('/users/:id/followers', checkAuth, getFollowers);
router.get('/users/:id/following', checkAuth, getFollowing);

module.exports = router;
