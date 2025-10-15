import bcrypt from "bcryptjs";

 function hashPassword(string){
    const salt = bcrypt.genSaltSync(12);
    const hash = bcrypt.hashSync(string, salt);
    return hash;
};

function comparePassword(string,hashString){
    return bcrypt.compareSync(string, hashString);
}

export default {
    comparePassword,
    hashPassword
};