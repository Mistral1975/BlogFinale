import userSchema from "../schema/userSchema.js";
import UnauthorizedException from "../exceptions/unauthorizedException.js";
import MongoInternalException from "../exceptions/mongoInternalException.js";

const add = async(content) => {
    try {
        const result = await new userSchema(content).save();
        return result.toJSON({versionKey:false});
    } catch (e) {
        if(e.message.indexOf('E11000 duplicate key error') > -1) {
            throw new UserAlreadyExistsException(`user ${content.email} already exists`, 100100);
        }
        throw new MongoInternalException(e.message, 100101);
    }
}

const confirmRegistration = async(id, token) => {
    try {
        const result = await userSchema.findOneAndUpdate({_id: id, registrationToken: token, status: 'pending'}, {$set: {status: 'active', registrationToken: null}}, {new: true});
        if(!result){
            throw new NotFoundException('user not found', 100102);
        }
        //console.log(result)
        if(result.status === "active"){
            return result.toJSON({versionKey:false});
        }
    } catch (e) {
        if(e.code === 100102) {
            throw e;
        }
        throw new MongoInternalException(e.message, 100103);        
    }
}

const getByEmail = async(email) => {
    const user = await userSchema.findOne({email: email, status: "active"});
    if(!user){
        throw new UnauthorizedException('Unauthorized', 111);
    }
    return user;
}

export default {
    add,
    confirmRegistration,
    getByEmail,
}