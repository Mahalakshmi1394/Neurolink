module.exports = function (req, res, next) {
    if (req.user && req.user.role === 'doctor') {
        next();
    } else {
        res.status(403).json({ message: 'Access denied: Doctors only' });
    }
};
