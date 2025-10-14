// middleware que analisa a autorização do usuário
import authService from "../services/AuthService.js";

const protectRoute = async (req, res, next) => {
    try { 
        // extrai o token da requisição
        const token = req.headers.authorization.replace("Bearer ", "");

        // verifica o token
        await authService.verifyIdToken(token);

        // segue para a proxima função
        next();
    } catch (error) {
        // levanta um erro se não estiver autenticado

        if (error.message === "Not authenticated") {
            res.status(401).json({ message: "Usuário não está logado." });
            return;
        }

        console.error("Erro enquanto analisando autenticação:", error.message);
        res.status(500).json({ message: "Aconteceu um erro interno no servidor." });
    }
}

export default protectRoute;