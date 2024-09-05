import activityService from "../services/activityService.js";

export default async (req, res) => {
    const { page = 1, limit = 10 } = req.query;

    try {
        const activities = await activityService.getList(page, limit);
        //console.log("activities ---->><<>>---- ", activities); // Aggiungi questo per verificare i dati
        res.status(200).json(activities);
    } catch (err) {
        console.error(err);
        res.status(err.status).json({ message: err.message });
    }
}