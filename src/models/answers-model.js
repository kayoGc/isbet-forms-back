// modelo do active, vai conter as provas liberadas para serem feitas
import mongoose from "mongoose";

const activeSchema = new mongoose.Schema({
    exam: { type: mongoose.Schema.Types.ObjectId, ref: "Exams", require: true },
    userUid: { type: String, require: true },
    // answers é um array do formato: [{question: ObjectId, answer: String}]
    answers: { type: Array, require: true },
})

const answersModel = mongoose.model("Answers", activeSchema);
export default answersModel;