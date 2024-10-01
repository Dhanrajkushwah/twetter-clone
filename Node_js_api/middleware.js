const jwt = require('jsonwebtoken');

const checkAuth = (req, res, next) => {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.split(' ')[1];

    if (token) {
        try {
            const decodedToken = jwt.verify(token, 'supersecretkey'); // Replace with your secret
            req.userId = decodedToken.userId; // Attach userId to request
            next();
        } catch (err) {
            return res.status(401).json({ message: 'Invalid token' });
        }
    } else {
        return res.status(401).json({ message: 'No token provided' });
    }
};

module.exports = checkAuth;
