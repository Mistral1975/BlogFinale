import activityService from "../services/activityService.js";

export default async (req, res) => {
    try {
        const activity = await activityService.removePost(req.params.id, req.userId);
        res.status(200).json(activity);
    } catch (err) {
        res.status(err.status).json({ message: err.message });
    }
}