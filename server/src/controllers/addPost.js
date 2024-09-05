import activityService from "../services/activityService.js";

export default async (req, res) => {
    try {
        const activity = await activityService.addPost({...req.body, userId: req.userId});
        res.status(201).json(activity);
    } catch (err){
        res.status(500).json({message: `something went wrong ${err}`});
    }
}