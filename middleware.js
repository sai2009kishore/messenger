var { verifyJWTToken } = require('./libs/auth');

function verifyJWT_MW(req, res, next) {
    let token = req.get('jwt-token');
    verifyJWTToken(token)
        .then((decodedToken) => {
            req.user = decodedToken.data
            next()
        })
        .catch((err) => {
            res.status(401)
                .json({ message: "You are not authorized to access this link" })
        })
}

module.exports = {
    verifyJWT_MW
}