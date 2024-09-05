import joi from 'joi';
import { createValidator } from 'express-joi-validation';

const validator = createValidator({passError:true});

export default [
    validator.params(
        joi.object().keys({
            id: joi.string().required().hex().length(24),
            commentId: joi.string().required().hex().length(24),
        })
    ),
]