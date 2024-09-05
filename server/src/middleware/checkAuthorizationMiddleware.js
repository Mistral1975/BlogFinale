import cryptoUtils from "../utils/cryptoUtils.js";

export default async (req, res, next) => {
    const authorizationHeader = req.headers.authorization;

    if (authorizationHeader) {
        const token = req.headers.authorization.split(' ')[1];
        try {
            const jwtDecoded = cryptoUtils.verifyJwt(token);
            if (!jwtDecoded) {
                return res.status(401).json({message: 'Unauthorized token 1'});
            }
            req.userId = jwtDecoded.subject;
            next();
        } catch(error) {
            return res.status(401).json({message: 'Unauthorized token 2' + error.message});

        }
    }else {
        return res.status(401).json({message: "Authorization required"});
    }   
}