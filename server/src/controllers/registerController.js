import { register } from "../services/userService.js";
import userNormalizer from "../normalizer/userNormalizer.js";

export default async (req, res) => {
    try {
        const user = await register(req.body);
        //console.log("USER ->>> ", user);
        res.status(201).json(userNormalizer(user));
    } catch(err) {
        res.status(err.status || 500).json({message: err.message, code:err.code} );
    }
}