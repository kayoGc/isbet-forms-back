import classModel from "../models/class-model.js";

const docObj = classModel;
const postRequiredParams = ["name"];

export default class ClassController {

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

            // manda uma mensagem de sucesso se deu tudo certo
            res.status(200).json({ message: "Turma criada com sucesso.", result: result });
        } catch (err) {
            console.error("Erro criando prova:", err.message);
            // em caso de erro interno do servidor
            res.status(500).json({ message: "Erro interno do servidor ao criar prova" });
        }
    }

}