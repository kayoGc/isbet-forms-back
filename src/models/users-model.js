import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// Schema de usuarios
const users = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    admin: { type: Boolean, required: true },
});

// antes de salvar vai transformar a senha em um hash
users.pre('save', async function()  {
    
    // em caso de update, se a senha não tiver mudado não precisa fazer nada
    if (!this.isModified("password")) {
        return;
    }

    try {
        // vai criptografar a senha
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(this.password, salt);

        this.password = hash;
        return;
    } catch (err) {
        // caso tenha dado erro na criptografia
        throw new Error("Erro ao criptografar senha:", err.message);
    }
})

// "users" vai se tornar o nome da coleção desse documento
const usersModel = mongoose.model("Users", users);

export default usersModel;