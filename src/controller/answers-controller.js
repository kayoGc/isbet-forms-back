import answersModel from "../models/answers-model.js";

const docObj = answersModel;

export default class AnswersController {

    /**
     * pega documentos, permite filtros
     */
    async get(req, res) {
        try {
            const { numOfDocs, page, exam, userUid, exists } = req.query;
            let limit = 10;
            let skip = 0;
            let filter = {};

            if (numOfDocs) {
                limit = parseInt(numOfDocs);
            }

            if (page) {
                // vai pular o número de documentos (limit) vezes o número da pagina - 1
                // exemplo: limit = 10 e page = 1 -> 10 * (1 - 0) = 10 * 0 = 0 => a primeira página pula 0 documentos
                // exemplo 2: limit = 10 e page = 2 -> 10 * (2 - 1) = 10 * 1 = 10 => a segunda página pula 10 documentos
                skip = limit * (parseInt(page) - 1);
            }

            // filtra por prova
            if (exam) {
                filter.exam = exam;
            }

            if (userUid) {
                filter.userUid = userUid;
            }

            const result = await docObj
                .find(filter)
                .skip(skip)
                .limit(limit)
                // lean pula algumas etapas do mongoose e reduz o tamanho do objeto retornado
                .lean();

            if (exists) {
                // se a resposta existe
                if (result.length > 0) {
                    res.json({ result: { exists: true} });
                    return;
                }

                res.json({ result: {exists: false} });
                return;
            }

            res.json({ result: result });
        } catch (err) {
            
            console.error(`Erro no UsersController: ${err.message}`);
            res.status(500).send();
        }
    }

    /**
     * Manda um documento para o banco de dados
     */
    async post(req, res) {
        try {
            // configura o documento
            const { exam, userUid, answers } = req.body;

            const doc = new docObj({
                exam: exam,
                userUid: userUid,
                answers: answers
            });

            // tenta salvar no banco de dados
            const result = await doc.save();

            res.status(200).json({ result: result });
        } catch (err) {
            console.error("Erro AnswersController:", err.message);
            res.status(500).send();
        }
    }

    /**
     * Vai atualizar os documentos
     */
    async put(req, res) {
        try {
            const { answers } = req.body;

            // vai guardar varias operações que serão feitas de uma vez
            let writeOperations = answers.map((obj) => {

                return {
                    updateOne: {
                        // procura o documento pelo _id
                        filter: { _id: obj._id},
                        update: obj 
                    }
                }

            });

            // vai tentar realizar todas as operações
            await docObj.bulkWrite(writeOperations);

            res.status(200).send();           
        } catch (err) {        
            console.error("Erro AnswersController:", err.message);
            res.status(500).send();
        }
    }

}