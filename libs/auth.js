var jwt = require('jsonwebtoken');
var { _ } = require('lodash');
var config = require('../config.json');

function verifyJWTToken(token) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, config.SECRET_KEY, (err, decodedToken) => {
            if (err || !decodedToken) {
                return reject(err)
            }

            resolve(decodedToken)
        });
    });
}

function createJWToken(details) {
    if (typeof details !== 'object') {
        details = {}
    }

    if (!details.maxAge || typeof details.maxAge !== 'number') {
        details.maxAge = 3600
    }

    details.sessionData = _.reduce(details.sessionData || {}, (memo, val, key) => {
        if (typeof val !== "function" && key !== "password") {
            memo[key] = val
        }
        return memo
    }, {})

    let token = jwt.sign(
        {
            data: details.sessionData
        },
        config.SECRET_KEY,
        process.env.JWT_SECRET, {
            expiresIn: details.maxAge,
            algorithm: 'HS256'
        })

    return token
}

module.exports = {
    verifyJWTToken,
    createJWToken
};