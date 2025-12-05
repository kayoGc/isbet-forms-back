import authService from '../services/AuthService.js'

/**
 * Essa função cria um middleware que checa se o usuário está logado antes de acessar uma rota
 * 
 * também consegue checar se o usuário é admin ou não
 * @param {Boolean} onlyAdmin se a rota é para administradores apenas 
 */
const createProtectMd = (onlyAdmin = false) => {

    // retorna uma função middleware que tem acesso aos parametros
    return async (req, res, next) => {
        try { 
            console.log(req.headers);

            if (!req.headers.authorization) {
                throw new Error("Not authenticated");
            }
    
            // extrai o token da requisição
            const token = req.headers.authorization.replace("Bearer ", "");
    
            // verifica o token
            const decoded = await authService.verifyIdToken(token);
    
            console.log(`Usuário logado com sucesso! nome: ${decoded.name}, email: ${decoded.email}`);

            if (onlyAdmin && !decoded.admin) {
                throw new Error("err admin");
            }
    
            // segue para a proxima função
            next();
        } catch (error) {
            // levanta um erro se não estiver autenticado ou não for admin
    
            if (error.message === "Not authenticated") {
                res.status(401).json({ message: "Usuário não está logado." });
                return;
            }
    
            if (error.message === "err admin") {
                res.status(403).json({ message: "Apenas admins tem acesso a essa rota." });
                return;
            }
    
            console.error("Erro enquanto analisando autenticação:", error.message);
            res.status(500).json({ message: "Aconteceu um erro interno no servidor." });
        }
    }

}

export const protectRoute = createProtectMd();
export const protectRouteAdmin = createProtectMd(true);