const jwt = require('jsonwebtoken');
const User = require('../models/user');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.JWT);
        const userId = decodedToken.userId;
        User.findOne({ _id: userId }).lean()
        .then((user) => {
            req.auth = { ...user, userId: userId };
            next();
        })
        .catch((err) => {
            throw new Error(err);
        })
    } catch(error) {
        res.status(401).json({ error });
    }
};