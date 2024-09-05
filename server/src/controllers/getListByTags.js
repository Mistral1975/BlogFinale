import activityService from "../services/activityService.js";

export default async (req, res) => {
    try {
        const activities = await activityService.getListByTags(req.params.tags);
        res.status(200).json(activities);
    } catch (err) {
        console.error(err);
        res.status(err.status).json({ message: err.message });
    }
}