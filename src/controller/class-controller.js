import classModel from "../models/class-model.js";

const docObj = classModel;
const postRequiredParams = ["name"];

export default class ClassController {

    /**
     * pega documentos, permite filtros
     */
    async get(req, res) {
        try {
            const { numOfDocs, page, name } = req.query;
            let limit = 10;
            let skip = 0;
            let filter = {};

            // se 0 for colocado no limite o mongoDb entende como não tem limite, então impedimos isso
            if (numOfDocs && numOfDocs !== "0") {
                limit = parseInt(numOfDocs);
            }

            if (page) {
                // vai pular o número de documentos (limit) vezes o número da pagina - 1
                // exemplo: limit = 10 e page = 1 -> 10 * (1 - 0) = 10 * 0 = 0 => a primeira página pula 0 documentos
                // exemplo 2: limit = 10 e page = 2 -> 10 * (2 - 1) = 10 * 1 = 10 => a segunda página pula 10 documentos
                skip = limit * (parseInt(page) - 1);
            }

            // filtra por nome
            if (name) {
                filter = {
                    name:  {
                        // o regex procura todos os documentos que contem a string name no atributo name
                        $regex: `^.*${name.trim()}.*$`,
                        // faz pesquisar de forma case-sensitive
                        $options: 'i'
                    }
                }
            }

            const result = await docObj
                .find(filter)
                .skip(skip)
                .limit(limit)
                // lean pula algumas etapas do mongoose e reduz o tamanho do objeto retornado
                .lean();

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
            const { name } = req.body;

            const doc = new docObj({
                name: name,
            });

            // tenta salvar no banco de dados
            const result = await doc.save();

            res.status(200).json({ result: result });
        } catch (err) {
            console.error("Erro ClassController:", err.message);
            res.status(500).send();
        }
    }

    /**
     * Vai atualizar os documentos
     */
    async put(req, res) {
        try {
            const { classes } = req.body;

            // vai guardar varias operações que serão feitas de uma vez
            let writeOperations = classes.map((obj) => {

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
            console.error("Erro ClassController:", err.message);
            res.status(500).send();
        }
    }

}