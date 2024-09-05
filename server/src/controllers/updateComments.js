import activityService from "../services/activityService.js";

export default async(req, res) => {
    try {
        const activity = await activityService.updateComments(req.params.commentId, {...req.body, userId: req.userId});
        res.status(200).json(activity);
    } catch (err){
        res.status(err.status).json({message: err.message});
    }
}