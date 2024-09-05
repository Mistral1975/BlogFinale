import activityService from "../services/activityService.js";

export const likePost = async (req, res) => {
    try {
        const post = await activityService.likePost(req.params.id, req.userId);
        res.status(200).json(post);
    } catch (err) {
        res.status(500).json({ message: `Something went wrong ${err}` });
    }
};

export const unlikePost = async (req, res) => {
    try {
        const post = await activityService.unlikePost(req.params.id, req.userId);
        res.status(200).json(post);
    } catch (err) {
        res.status(500).json({ message: `Something went wrong ${err}` });
    }
};
