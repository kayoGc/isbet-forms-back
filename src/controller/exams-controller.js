import examsModel from "../models/exams-model.js";

const docObj = examsModel;

const postRequiredParams = ["author", "name", "available"];

export default class ExamsController {

    // metodo get que vai pegar todos os documentos
    async getAll(req, res) {
        try {
            // tenta pegar todos os documentos do model
            const result = await docObj.find({}).lean();

            res.status(200).json({ result: result });
        } catch (err) {
            console.error("Erro ExamsController->getAll:", err.message);
            res.status(500).send();
        }
    }

    // metodo get que vai pegar um documento especifico
    async getById(req, res) {
        try {
            const { id } = req.params;

            // tenta pegar o documento
            const result = await docObj
                .findById(id)
                .lean()
                .populate("questions");

            res.status(200).json({ result: result });
        } catch (err) {

            console.error("Erro ExamsConstroller->getById:", err.message);
            res.status(500).send();
        }
    }

    // metodo post que vai postar um documento
    async post(req, res) {
        try {
            // configura o documento
            const { author, name, available } = req.body;

            const doc = new docObj({
                author: author,
                name: name,
                available: available,
            });

            // tenta salvar no banco de dados
            const result = await doc.save();

            // manda uma mensagem de sucesso se deu tudo certo
            res.status(200).json({ result: result });
        } catch (err) {
            console.error("Erro ExamsController->post:", err.message);
            res.status(500).send();
        }
    }

    // vai atualizar um documento
    async put(req, res) {
        try {
            const { id } = req.params;

            let updateData = {};
            // vai passar por cada entrada do body
            for (const entry of Object.entries(req.body)) {
                const key = entry[0];
                const value = entry[1];
                
                // ignora qualquer parametro que não exista no model
                if (!postRequiredParams.includes(key)) {
                    continue;
                }

                updateData[key] = value;
            }

            if (Object.keys(updateData).length === 0) {
                res.status(200).send();
            }

            // faz a atualização
            const result = await docObj.updateOne({ _id: id }, updateData);
            
            // se não achou o documento
            if (result.matchedCount == 0) {
                throw new Error("404 - Documento não encontrado")
            }
            
            res.status(200).send();
        } catch (err) {
            if (err.message.startsWith("404")) {
                res.status(400).json({ message: err.message.replace("404 - ", "") });
                return;
            }

            console.error("Erro ExamsController->put:", err.message);
            res.status(500).send();
        }
    }

}