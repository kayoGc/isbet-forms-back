import examsModel from "../models/exams-model.js";

const docObj = examsModel;

const postRequiredParams = ["author", "name", "available", "classNum"];

export default class ExamsController {


    // metodo get que vai pegar todos os documentos
    async getAll(req, res) {
        try {
            // tenta pegar todos os documentos do model
            const result = await docObj.find({});

            res.status(200).json({ message: "Sucesso pegando todas as provas", result: result });
        } catch (err) {

            console.error("Erro ao pegar provas:", err.message);
            res.status(500).json({ message: "Erro interno do servidor ao pegar todas as provas" });
        }
    }

    // metodo get que vai pegar um documento especifico
    async getById(req, res) {
        try {
            const _id = req.params.id;

            // tenta pegar o documento
            const result = await docObj.findById(_id).populate("questions").exec();

            res.status(200).json({ message: "Sucesso pegando prova", result: result });
        } catch (err) {

            console.error("Erro ao pegar provas:", err.message);
            res.status(500).json({ message: "Erro interno do servidor ao pegar todas as provas" });
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
                                
                if (!req.body[param] && req.body[param] !== false) {
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
            const { author, name, available, classNum } = req.body;
            const doc = new docObj({
                author: author,
                name: name,
                available: available,
                classNum: classNum
            });
            // tenta salvar no banco de dados
            const result = await doc.save();

            // manda uma mensagem de sucesso se deu tudo certo
            res.status(200).json({ message: "Prova criada com sucesso.", result: result });
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

            console.error("Erro criando prova:", err.message);
            // em caso de erro interno do servidor
            res.status(500).json({ message: "Erro interno do servidor ao criar prova" });
        }
    }

}