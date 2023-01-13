const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const generateJwt = async (data) => {
    try {
        const token = await jwt.sign(data, "MySuperSecretPrivateKey", { expiresIn: '1h' });
        return token;
    } catch (error) {
        console.error(error);
    }
}

const encryptPassword = async (password) => {
    try {
        const encryptedPassword = await bcrypt.hashSync(password, 10);
        return encryptedPassword;
    } catch (error) {
        console.error(error);
    }
}

module.exports = { generateJwt, encryptPassword };