import activityService from '../services/activityService.js';

export default async (req, res) => {
    try {
        const activity = await activityService.getPost(req.params.id);
        res.status(200).json(activity);
    } catch (err) {
        res.status(err.status).json({ message: err.message });
    }
};