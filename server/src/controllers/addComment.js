import activityService from "../services/activityService.js";

export default async(req, res) => {
    try {
        const comment = await activityService.addComment(req.params.id, { ...req.body, userId: req.userId });
        res.status(201).json(comment);
      } catch (err) {
        res.status(500).json({ message: `something went wrong ${err}` });
      }
}