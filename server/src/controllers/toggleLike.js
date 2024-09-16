/* import activityService from "../services/activityService.js";

export default async(req, res) => {
    try {
        const post = await activityService.toggleLike(req.params.id, req.userId);
        res.status(200).json(post);
    } catch (err) {
        res.status(500).json({ message: `Something went wrong ${err}` });
    }
}; */

// src/controllers/toggleLike.js
import activityService from '../services/activityService.js';

const toggleLike = async (req, res) => {
    const { id } = req.params;  // ID del post
    const userId = req.userId;  // ID dell'utente autenticato

    // Log per verificare se i parametri sono corretti
    console.log(`ID del post: ${id}, ID utente: ${userId}`);

    try {
        const updatedPost = await activityService.toggleLike(id, userId); // Chiamata al service per gestire il like
        res.status(200).json(updatedPost);  // Restituiamo il post aggiornato con i like
    } catch (err) {
        res.status(500).json({ message: `Errore nella gestione del like: ${err.message}` });
    }
};

export default toggleLike;
