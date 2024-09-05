import DomainException from './domainExceptions.js';

class UnauthorizedException extends DomainException {
    constructor(message, code){
        super(message);
        //this.message = message;
        this.status = 401;
        this.code = code || null;
    }
}
export default UnauthorizedException;