// modelo do active, vai conter as provas liberadas para serem feitas
import mongoose from "mongoose";

const activeSchema = new mongoose.Schema({
    // turma que a prova está sendo liberada
    classId: { type: mongoose.Schema.Types.ObjectId, ref: "Classes", require: true },
    // prova que está sendo liberada
    examId: { type: mongoose.Schema.Types.ObjectId, ref: "Exams", require: true },
})

const activeModel = mongoose.model("Active", activeSchema);
export default activeModel;