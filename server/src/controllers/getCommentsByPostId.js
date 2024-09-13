import activityService from "../services/activityService.js";

/* export default async (req, res) => {
    const { page = 1, limit = 10 } = req.query;

    try {
        const activities = await activityService.getCommentsByPostId(req.params.id, page, limit);
        res.status(200).json(activities);
    } catch (err) {
        res.status(err.status).json({ message: err.message });
    }
} */

    export default async (req, res) => {
        try {
            const activities = await activityService.getCommentsByPostId(req.params.id);
            res.status(200).json(activities);
        } catch (err) {
            res.status(err.status).json({ message: err.message });
        }
    }