import joi from 'joi'; //modulo di node per validazione dei dati
import { createValidator } from 'express-joi-validation';

const validator = createValidator({passError:true});

export default [
    validator.body(
        joi.object().keys({
            description: joi.string().required(), // Descrizione del Commento
            userId: joi.string().optional(), // Permettiamo userId (verrà aggiunto dal backend)
            postId: joi.string().optional(), // Permettiamo postId (verrà aggiunto dal backend)
        }) // Non permettiamo altri campi come _id, createdAt, updatedAt, __v
    ),
];