import jwt from "jsonwebtoken"

const protectRoute = async (req, res, next) => {
    try { 
        // pega o token
        const token = req.cookies.secretToken;

        // se o token não existe
        if (!token) {
            throw new Error("Not authenticated");
        }

        try {
            // verifica se o token está correto
            jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            // se a verificação falhar um erro acontece
            console.error("jwt error:", error.message);
            throw new Error("Not authenticated");
        }

        next();
    } catch (error) {

        if (error.message === "Not authenticated") {
            res.status(401).json({ message: "Usuário não está logado." });
            return;
        }

        console.error("Erro enquanto analisando autenticação:", error.message);
        res.status(500).json({ message: "Aconteceu um erro interno no servidor." });
    }
}

export default protectRoute;