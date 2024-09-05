import joi from 'joi'; 
import { createValidator } from 'express-joi-validation';

const validator = createValidator({passError: true}); 

export default [
    validator.body(
        joi.object().keys({
            description: joi.string().required(),
            //updatedAt: joi.number().required(), 
        })
    ),
    validator.params(
        joi.object().keys({
            'id': joi.string().hex().length(24).required(),
            'commentId': joi.string().hex().length(24).required(),
        }),
    ),
    validator.headers(
        joi.object().keys({
            'content-type': joi.string().valid('application/json').required(),
        }).unknown(),
    )
]