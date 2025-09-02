import usersModel from "../models/users-model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const docObj = usersModel;

const postRequiredParams = ["email", "password", "name", "admin"];

export default class UsersController {

    // vai logar o usuário
    async login(req, res) {
        try {
            // se não tiver o body em primeiro lugar cria um erro
            if (!req.body) {
                throw new Error("No body");
            }

            // essa parte checa se está faltando algum parametro para criar o documento
            let missingParams = [];
            // só vai verificar se tem o email e password
            const postRequiredParams2 = postRequiredParams.slice(0, 1);
            // passa por cada parametro necessário e checa se esta no body da requisição
            for (const param of postRequiredParams2) {

                if (!req.body[param]) {
                    missingParams.push(param);
                }

            }

            const { email, password } = req.body; 

            // vai buscar o usuário no banco de dados
            const userDb = await docObj.findOne({ email: email });
            
            // se o usuário não for achado
            if (!userDb) {
                throw new Error("404");
            }

            // vai comparar a senha mandada com a do banco de dados
            if (!(await bcrypt.compare(password, userDb.password))) {
                // se a senha não bater
                throw new Error("401");
            }

            // cria um token para ser utilizado em rotas que precisam de autenticação
            let token = jwt.sign({ id: userDb._id }, process.env.JWT_SECRET);
            // cria uma cookie http only, que vai guardar o token do jwt
            res.cookie("secretToken", token, {
                httpOnly: true,
                sameSite: "strict",
                maxAge: 3600000,
            });

            // manda os dados do usuário de volta
            let result = {
                _id: userDb._id,
                email: userDb.email,
                name: userDb.name,
                admin: userDb.admin
            }

            res.status(200).json({ message: "Usuário logado com sucesso.", result: result });
        } catch (err) {
            // se estava faltando parametros na requisição manda de volta o codigo 400 (bad request)
            if (err.message.startsWith("Missing params:")) {
                res.status(400).json({ message: err.message });
                return;
            }

            // se nenhum dado foi enviado
            if (err.message == "No body") {
                res.status(400).json({ message: "No data was sended" });
                return;
            }

            // usuário não foi achado, provavelmente não tem conta
            if (err.message == "404") {
                res.status(404).json({ message: "Usuário não foi achado" });
                return;
            }

            if (err.message == "401") {
                res.status(401).json({ message: "Credenciais invalídas" });
                return;
            }

            console.error("Erro logando Usuário:", err.message);
            // em caso de erro interno do servidor
            res.status(500).json({ message: "Erro interno do servidor ao logar usuário" });
        }
    }

    // vai criar um usuário
    async register(req, res) {

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

            // configura os dados
            const { email, password, name, admin } = req.body;
            const user = new docObj({
                email: email,
                password: password,
                name: name,
                admin: admin
            });

            // vai tentar salvar
            await user.save();

            // se chegar aqui deu bom
            res.status(201).json({ message: "Usuário criado com sucesso!" });
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

            // codigo transmitido pelo mongoose para duplicadas
            if (err.message.startsWith("E11000")) {
                res.status(400).json({ message: "Email já tem uma conta." });
                return;
            }

            console.error("Erro criando Usuário:", err.message);
            // em caso de erro interno do servidor
            res.status(500).json({ message: "Erro interno do servidor ao criar usuário" });
        }
    }

}