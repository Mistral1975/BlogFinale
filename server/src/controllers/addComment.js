import activityService from "../services/activityService.js";

export default async(req, res) => {
    try {
      console.log("Request body:", req.body); // Aggiungi questo per il debug
        const comment = await activityService.addComment(req.params.id, { ...req.body, userId: req.userId });
        res.status(201).json(comment);
      } catch (err) {
        console.error("Error adding comment:", err); // Aggiungi questo per il debug
        res.status(500).json({ message: `something went wrong ${err}` });
      }
}