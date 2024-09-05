import { confirmRegistration } from "../services/userService.js";

export default async (req, res) => {
    try {
        await confirmRegistration(req.params.id, req.params.token);
        res.status(200).send('ok');
    } catch(err) {
        res.status(err.status || 500);
        res.send(JSON.stringify({message: err.message, code: err.code}))
    }
}