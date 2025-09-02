import mongoose from "mongoose";

// Schema de perguntas
const questions = new mongoose.Schema({
    question: String,
    type: String,
    options: [String],
    // correct vai conter os indexes que são corretos
    correct: [Number],
    // liga a pergunta a um documento de prova
    exam: { type: mongoose.Schema.Types.ObjectId, ref: "Exams", required: true}
});

// "questions" vai se tornar o nome da coleção desse documento
const questionsModel = mongoose.model("Questions", questions);

export default questionsModel;