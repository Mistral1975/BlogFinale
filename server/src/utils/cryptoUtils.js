import cryptoRandomString from "crypto-random-string";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import {privateKey, publicKey} from "../../config.js";
import unauthorizedException from "../exceptions/unauthorizedException.js"

class CriptoUtils {
    generateUniqueCode(length, type) {
        return cryptoRandomString({length: length, type: type || 'base64'});
    }
    hashPassword(password) {
        let salt = this.generateUniqueCode(10);
        return {
            password: sha256(password, salt),
            salt: salt,
        };
    }
    compare(value, salt, hashedValue) {
        return salt ? sha256(value, salt) === hashedValue : false;
    }
    generateUrlEncodedCode(length) {
        const code = this.generateUniqueCode(length);
        return encodeURIComponent(code);
    }
    generateToken = (user, timestamp) => {
        return jwt.sign(
            {
                email: user.email,
                subject: user._id,
                //displayName: user.name,
                expiration: timestamp,
            },
            privateKey,
            {
                expiresIn: timestamp,
                algorithm: 'RS256',    
            }
        );
    };
    generateTokens(user) {
        return {
            accessToken: this.generateToken(user, 86400), // 1 day
            refreshToken: this.generateToken(user, 86400*30), // 1 month
        };
    }
    verifyJwt(token) {        
        try {
            const jwtDecoded = jwt.verify(token, publicKey, {algorithms: ["RS256"], ignoreExpiration: false});
            return jwtDecoded;
        } catch (error) {
            throw new unauthorizedException(err.message);
        }
    }
}

const sha256 = (value, salt) => {
    return crypto.createHmac('sha256', salt).update(value).digest('hex');
};

export default new CriptoUtils();