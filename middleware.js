var { verifyJWTToken } = require('./libs/auth');

function verifyJWT_MW(req, res, next) {
    let token = req.get('Authorization');
    if (req.method === 'OPTIONS') {
        res.status(200).send();
    } else {
        verifyJWTToken(token)
            .then((decodedToken) => {
                next()
            })
            .catch((err) => {
                res.status(401)
                    .json({ message: "You are not authorized to access this link" })
            })
    }
}

module.exports = {
    verifyJWT_MW
}