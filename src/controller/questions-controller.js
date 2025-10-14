import questionsModel from "../models/questions-model.js";
import examsModel from "../models/exams-model.js";

const docObj = questionsModel;

const postRequiredParams = ["question", "type", "options", "correct", "exam"];

export default class QuestionsController {

    // metodo get que vai pegar todos os documentos
    async getAll(req, res) {
        try {
            // tenta pegar todos os documentos do model
            const result = await docObj.find({});

            res.status(200).json({ message: "Sucesso pegando todas as questões", result: result });
        } catch (err) {

            console.error("Erro ao pegar questões:", err.message);
            res.status(500).json({ message: "Erro interno do servidor ao pegar todas as questões" });
        }
    }

    // metodo post que vai postar um documento
    async post(req, res) {
        try {

            // se não tiver o body em primeiro lugar cria um erro
            if (!req.body) {
                throw new Error("No body");
            }
            
            // essa parte checa se está faltando algum parametro para criar o documento
            let missingParams = [];
            // passa por cada parametro necessário e checa se esta no body da requisição
            for (const param of postRequiredParams) {
                                
                if (!req.body[param]) {
                    missingParams.push(param);
                }

            }
            
            // vai criar um erro se tiver faltando parametros
            if (missingParams.length > 0) {
                let errMsg = "Missing params: ";

                for (const param of missingParams) {
                    errMsg += `${param} `;
                }

                throw new Error(errMsg);
            }   

            // configura o documento
            const { question, type, options, correct, exam } = req.body;
            const doc = new docObj({
                question: question,
                type: type,
                options: options,
                correct: correct,
                exam: exam
            });
            // tenta salvar no banco de dados
            const result = await doc.save();

            // depois de colocar uma pergunta vai pegar o id e colocar na prova que ele pertence
            const fatherExam = await examsModel.findById(exam);
            fatherExam.questions.push(result._id);
            await examsModel.updateOne(fatherExam);

            // manda uma mensagem de sucesso se deu tudo certo
            res.status(200).json({ message: "Questão criada com sucesso.", result: result });
        } catch (err) {
            // se estava faltando parametros na requisição manda de volta o codigo 400 (bad request)
            if (err.message.startsWith("Missing params:")) {
                res.status(400).json({ message: err.message });
                return;
            }

            if (err.message == "No body") {
                res.status(400).json({ message: "No data was sended" });
                return;
            }

            console.error("Erro criando questão:", err.message);
            // em caso de erro interno do servidor
            res.status(500).json({ message: "Erro interno do servidor ao criar questão" });
        }
    }

    // metodo post que vai postar varios documentos
    async postMany(req, res) {
        try {
            // se não tiver o body em primeiro lugar cria um erro
            if (!req.body) {
                throw new Error("400 - No data was sended");
            }

            // validações no array de documentos
            if (!req.body.questions) {
                throw new Error("400 - Missing data: questions");
            }
                       
            const { questions } = req.body;
 
            if (!Array.isArray(questions)) {
                throw new Error("400 - Questions must be an array");
            }

            if (questions.length === 0) {
                throw new Error("400 - Questions array is empty");
            }

            let examId = null;
            // passa por todos os documentos e analisa se possuem os parametros necessários
            questions.forEach((question, index) => {

                // Verifica se cada questão é um objeto
                if (typeof question !== 'object') {
                    throw new Error(`400 - Invalid data type in the question ${index + 1}`); 
                }

                // essa parte checa se está faltando algum parametro para criar os documentos
                let missingParams = [];
                // passa por cada parametro necessário e checa se esta no body da requisição
                for (const param of postRequiredParams) {
                                    
                    if (!question[param]) {
                        missingParams.push(param);
                    }
    
                }

                // vai criar um erro se tiver faltando parametros
                if (missingParams.length > 0) {
                    let errMsg = `400 - Missing data in question ${index + 1}: `;
    
                    for (const param of missingParams) {
                        errMsg += `${param} `;
                    }
    
                    throw new Error(errMsg);
                }   

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
                await examsModel.updateOne({ _id: examId }, { $push: { questions: { $each: Object.values(insertedDocs.insertedIds) } }  });
            } catch (err) {
                // TODO: lidar quando não der erro na criação das perguntas mas der erro ao adicionar na prova
            }
            
            res.status(200).json({ message: "Sucesso inserindo multiplas questões" });
        } catch (err) {

            // erros 400 - bad request
            if (err.message.startsWith("400")) {
                res.status(400).json({ message: err.message.replace("400 - ", "") });
                return;
            }
            
            console.error("Erro ao inserir multiplas questões:", err.message);
            res.status(500).json({ message: "Erro interno do servidor" });
        }
    }

    // vai deletar documentos, 1 ou mais
    async delete(req, res) {
        try {
            // se não tiver body
            if (!req.body) {
                throw new Error("400 - Nenhum dado foi enviado");
            }

            // se não tiver o array ids
            if (!req.body.ids) {
                throw new Error("400 - Faltando parametro: ids");
            }
            
            if (!req.body.examId) {
                throw new Error("400 - Faltando parametro: examId");
            }

            // vai ser um array contendo os ids dos documentos
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
            res.status(200).send({ message: "Questão(ões) apaga(s) com sucesso." });
        } catch (err) {
            // erros 400 - bad request
            if (err.message.startsWith("400")) {
                res.status(400).json({ message: err.message.replace("400 - ", "") });
                return;
            }

            // erros 404 - not found
            if (err.message.startsWith("404")) {
                res.status(404).json({ message: err.message.replace("404 - ", "") });
                return;
            }

            console.error("Erro ao deletar questão:", err.message);
            res.status(500).json({ message: "Erro interno do servidor ao deletar questão" });
        }
    }
    
    async put(req, res) {
        try {
            // se não tiver body
            if (!req.body) {
                throw new Error("400 - Nenhum dado foi enviado");
            }
            
            // se não tiver o array ids
            if (!req.body.questions) {
                throw new Error("400 - Faltando parametro: questions");
            }

            if (req.body.questions.length === 0) {
                throw new Error("400 - Nenhuma questão mandada para atualização");
            }
            
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

            res.status(200).json({ message: "Items atualizados com sucesso." });           
        } catch (err) {
            // erros 400 - bad request
            if (err.message.startsWith("400")) {
                res.status(400).json({ message: err.message.replace("400 - ", "") });
                return;
            }
        
            // erros 404 - not found
            if (err.message.startsWith("404")) {
                res.status(404).json({ message: err.message.replace("404 - ", "") });
                return;
            }
        
            console.error("Erro ao deletar questão:", err.message);
            res.status(500).json({ message: "Erro interno do servidor ao atualizar questão" });
        }
    }
}