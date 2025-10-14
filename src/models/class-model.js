// modelo das turmas
import mongoose from "mongoose";

const classSchema = new mongoose.Schema({
    // nome da turma
    name: { type: String, required: true }
})

const classModel = mongoose.model("Classes", classSchema);
export default classModel;