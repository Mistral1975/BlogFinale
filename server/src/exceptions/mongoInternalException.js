import InternalServerException from './internalServerException.js';

class MongoInternalException extends InternalServerException {
    constructor(message, code){
        super(message, code);
    }
}
export default MongoInternalException;