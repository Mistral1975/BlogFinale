import activityService from "../services/activityService.js";

export default async (req, res) => {
    try {
        const activity = await activityService.updateCategories(req.params.id, {...req.body, userId: req.userId, categoriesId: req.categoriesId, isAdmin: req.isAdmin});
        res.status(200).json(activity);
    } catch (err){
        res.status(err.status).json({message: err.message});
    }
}