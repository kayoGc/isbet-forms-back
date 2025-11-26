import usersModel from "../models/users-model.js";
import authService from "../services/AuthService.js";

const docObj = usersModel;

const postRequiredParams = ["email", "password", "name"];

export default class UsersController {

    /**
     * Vai pegar e retornar dados dos usuários.
     * A requisição tem os seguintes parametos opcionais:
     * 
     * numOfDocs: número de usuários que serão retornados
     * 
     * page: qual página será retornada (ajuda no calculo de quantos documentos serão pulados)
     * 
     * classId: de qual turma os usuários pertencem, null para os que não tem nenhuma
     */
    async get(req, res) {
        try {
            const { numOfDocs, page, classId } = req.query;
            let limit = 10;
            let skip = 0;
            let filter = {};

            // depedendo dos parametros passados muda a query
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

            if (classId) {
                // req.query sempre retorna strings então tem que converter null manualmente
                if (classId === "null") {
                    filter.class = null;
                } else {
                    filter.class = classId;
                }
            }

            const dbUsers = await docObj
                .find(filter, "uid _id")
                .skip(skip)
                .limit(limit)
                // lean pula algumas etapas do mongoose e reduz o tamanho do objeto retornado
                .lean();

            let result = [];
            
            if (dbUsers.length > 0) {
                let uids = dbUsers.map((user) => {
                    return { uid: user.uid }
                });

                const { success, error, users } = await authService.getUsers(uids);

                if (!success) {
                    throw new Error(error);
                }

                result = users;
            }

            res.json({ result: result });
        } catch (err) {
            console.error(`Erro UsersController->get: ${err.message}`);

            res.status(500).send();
        }
    }

    // metodo get que vai pegar um documento especifico
    async getByUid(req, res) {
        try {
            const { uid } = req.params;

            // tenta pegar o documento
            const result = await docObj
                .find({ uid: uid })
                .lean()

            res.status(200).json({ result: result });
        } catch (err) {

            console.error("Erro UsersController->getById:", err.message);
            res.status(500).send();
        }
    }

    // vai criar um usuário
    async register(req, res) {
        try {
            // configura os dados
            const { email, password, name, admin } = req.body;

            // cria o usuário no firebase
            const { success, uid, error } = await authService.createNewUser(email, password, name);

            if (!success) {
                throw new Error(error.code);
            }

            // cria um novo usuário
            const user = new docObj({
                uid: uid,
                email: email,
                name: name
            });

            // vai tentar salvar
            await user.save();

            // se chegar aqui deu bom
            res.status(201).json({ message: "Usuário criado com sucesso!", userUid: uid });
        } catch (err) {
            // codigo transmitido pelo firebase para email já existente
            if (err.message === "auth/email-already-exists") {
                res.status(400).json({ message: "Email já tem uma conta." });
                return;
            }

            console.error("Erro criando Usuário:", err.message);
            // em caso de erro interno do servidor
            res.status(500).send();
        }
    }

    /**
     * Vai atualizar os documentos
     */
    async put(req, res) {
        try {
            const { users } = req.body;

            // userIds vai ser usado para atualizar a turma
            let writeOperations = users.map((obj) => {
                return {
                    updateOne: {
                        // procura o documento pelo _id
                        filter: { uid: obj.uid },
                        update: obj
                    }
                }
            });

            // bulkWrite executa varias operações no DB de uma vez
            await docObj.bulkWrite(writeOperations);

            res.status(200).send();
        } catch (err) {
            console.error("Erro no UsersController:", err.message);
            res.status(500).send();
        }
    }

}