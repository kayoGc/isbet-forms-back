import mongoose from "mongoose";

// Schema de provas
const exams = new mongoose.Schema({
    author: String,
    name: String,
    available: Boolean,
    classNum: Number,
    questions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Questions"}]
});

// "exams" vai se tornar o nome da coleção desse documento
const examsModel = mongoose.model("Exams", exams);

export default examsModel;