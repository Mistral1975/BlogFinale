import joi from 'joi';
import { createValidator } from 'express-joi-validation';

const validator = createValidator({passError:true});

export default [
    validator.params(
        joi.object().keys({
            tags: joi.string().required(),
        })
    ),
]