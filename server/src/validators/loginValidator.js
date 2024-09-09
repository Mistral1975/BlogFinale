import joi from 'joi';
import { createValidator} from 'express-joi-validation'; 
  const validator = createValidator({passError:true});

export default  [
    validator.body(
        joi.object().keys({
            email: joi.string().required(),
            password: joi.string().required(),
        })
    ),
]