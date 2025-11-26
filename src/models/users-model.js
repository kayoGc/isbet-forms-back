import mongoose from "mongoose";

// Schema de usuarios
const users = new mongoose.Schema({
    // uid que vem do firebase
    uid: { type: String, require: true },
    // turma que o usuário pertence
    class: { type: mongoose.Schema.Types.ObjectId, ref: "Classes", default: null}
});

// "users" vai se tornar o nome da coleção desse documento
const usersModel = mongoose.model("Users", users);

export default usersModel;