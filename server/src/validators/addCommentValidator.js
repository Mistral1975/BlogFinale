import joi from 'joi'; //modulo di node per validazione dei dati
import { createValidator } from 'express-joi-validation';

const validator = createValidator({passError:true});

export default [
    validator.body(
        joi.object().keys({
            description: joi.string().required(), // Descrizione del Commento
        })
    ),
]