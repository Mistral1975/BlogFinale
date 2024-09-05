import joi from 'joi';
import {createValidator}  from 'express-joi-validation';
const validator = createValidator({passError: true});

export default [
    validator.params(
        joi.object().keys({
            "id": joi.string().hex().length(24).required(),
            "token": joi.string().min(10).required(),
        })
    ),
]