import activityService from "../services/activityService.js";

export default async (req, res) => {
    try {
        // Rimuovi il commento
        const activity = await activityService.removeComments(req.params.id, req.params.commentId, req.userId);
        res.status(200).json(activity); // Risposta con codice 200 e il dato dell'attività
    } catch (err) {
        console.error('Errore nella rimozione del commento:', err); // Log dell'errore per debug

        // Imposta un codice di stato predefinito se `err.status` non è definito
        const statusCode = err.status || 500; // Usa 500 se `err.status` non è definito

        res.status(statusCode).json({
            message: err.message || 'Errore interno del server' // Usa un messaggio predefinito se `err.message` non è definito
        });
    }
}