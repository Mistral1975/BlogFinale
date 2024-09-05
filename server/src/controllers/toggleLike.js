import activityService from "../services/activityService.js";

export default async(req, res) => {
    try {
        const post = await activityService.toggleLike(req.params.id, req.userId);
        res.status(200).json(post);
    } catch (err) {
        res.status(500).json({ message: `Something went wrong ${err}` });
    }
};
