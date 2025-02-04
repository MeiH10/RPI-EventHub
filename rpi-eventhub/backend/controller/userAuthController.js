/**
 * router.get('/verify-token', authenticate, verifyToken);
 * @param req
 * @param res
 */
const verifyToken = (req, res) => {
    res.sendStatus(200);
};

module.exports = { verifyToken };
