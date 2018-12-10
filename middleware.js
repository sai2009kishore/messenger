var { verifyJWTToken } = require('./libs/auth');

function verifyJWT_MW(req, res, next) {
    let token = req.get('jwt-token');
    console.log(token);
    verifyJWTToken(token)
        .then((decodedToken) => {
            req.user = decodedToken.data
            next()
        })
        .catch((err) => {
            res.status(400)
                .json({ message: "Invalid auth token provided." })
        })
}

module.exports = {
    verifyJWT_MW
}