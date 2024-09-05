import activityService from "../services/activityService.js";

export default async (req, res) => {
    //console.log(req)
    try {
        const activity = await activityService.updatePost(req.params.id, { ...req.body, userId: req.userId });
        res.status(200).json(activity);
    } catch (err) {
        res.status(err.status).json({ message: err.message });
    }
}