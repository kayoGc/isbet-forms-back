import questionsModel from "../models/questions-model.js";
import examsModel from "../models/exams-model.js";

const docObj = questionsModel;

export default class QuestionsController {

    // metodo get que vai pegar todos os documentos
    async getAll(req, res) {
        try {
            // tenta pegar todos os documentos do model
            const result = await docObj.find({});

            res.status(200).json({ result: result });
        } catch (err) {

            console.error("Erro QuestionController->getAll:", err.message);
            res.status(500).send();
        }
    }

    // metodo post que vai postar um documento
    async post(req, res) {
        try {
            const { question, type, options, correct, exam } = req.body;
            
            const doc = new docObj({
                question: question,
                type: type,
                options: options,
                correct: correct,
                exam: exam
            });
            
            const result = await doc.save();

            await examsModel.updateOne(
                { _id: exam }, 
                { $push: { questions: result.id } }
            );

            res.status(200).json({ result: result });
        } catch (err) {

            console.error("Erro QuestionController->post:", err.message);
            res.status(500).send();
        }
    }

    // metodo post que vai postar varios documentos
    async postMany(req, res) {
        try {          
            const { questions } = req.body;

            let examId = null;
            questions.forEach((question) => {
                // guarda o id do exame para depois adicionar as questões nele
                if (!examId) {
                    examId = question.exam;
                }

                // checa se todas as questões pertencem ao mesmo exame
                if (question.exam !== examId) {
                    throw new Error("400 - All questions must belong to the same exam");
                }
            })
            
            const insertedDocs = await docObj.insertMany(questions, { rawResult: true });
        
            try {
                // depois de colocar as perguntas vai pegar os ids e colocar na prova que elas pertence
                await examsModel.updateOne(
                    { _id: examId }, 
                    { $push: { questions: { $each: Object.values(insertedDocs.insertedIds)}}}
                );
            } catch (err) {
                // TODO: lidar quando não der erro na criação das perguntas mas der erro ao adicionar na prova
            }
            
            res.status(200).send();
        } catch (err) {

            // erros 400 - bad request
            if (err.message.startsWith("400")) {
                res.status(400).json({ message: err.message.replace("400 - ", "") });
                return;
            }
            
            console.error("Erro QuestionController->postMany:", err.message);
            res.status(500).send();
        }
    }

    // vai deletar documentos, 1 ou mais
    async delete(req, res) {
        try {
            const { ids, examId } = req.body;

            // tenta deletar os documento
            const { deletedCount } = await docObj.deleteMany({ _id: { $in: ids } });

            if (deletedCount === 0) {
                throw new Error("404 - Questão(ões) não encontrada(s)");
            }

            // vai tirar as questões da prova que elas pertencem
            await examsModel.updateOne({_id: examId }, { $pullAll: { questions: ids }});

            // TODO: fazer algo se falhar ao apagar as questões do documento exame?

            // TODO: analisar se todos os documentos foram deletados

            // indica na resposta que foi deletado
            res.status(200).send();
        } catch (err) {
            // erros 404 - not found
            if (err.message.startsWith("404")) {
                res.status(404).json({ message: err.message.replace("404 - ", "") });
                return;
            }

            console.error("Erro QuestionController->delete:", err.message);
            res.status(500).send();
        }
    }
    
    async put(req, res) {
        try {
            const { questions } = req.body;

            // vai guardar varias operações que serão feitas de uma vez
            let writeOperations = questions.map((question) => {
                return {
                    updateOne: {
                        filter: { _id: question._id},
                        update: question 
                    }
                }
            });

            // vai tentar realizar todas as operações
            await docObj.bulkWrite(writeOperations);

            res.status(200).send();           
        } catch (err) {
            console.error("Erro QuestionController->put:", err.message);
            res.status(500).send();
        }
    }
}