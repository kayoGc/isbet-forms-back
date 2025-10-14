/**
 * Essa função cria um middleware que vai checar o corpo das requisições,
 * se não estiver adequado impede de continuar a requisição
 * @param {Array} requiredData Array contendo strings, essas strings são os nomes de campos que precisam estar na requisição
 */
export function createCheckMd(requiredData) {
    return function(req, res, next) {
        try {
            if (!req.body) {
                throw new Error("Nenhum dado mandado na requisição.");
            }
    
            // essa parte checa se está faltando algum parametro para criar o documento
            let missingParams = [];
            for (const param of requiredData) {

                if (!req.body[param] && req.body[param] !== false) {
                    missingParams.push(param);
                }
            }
    
            // vai criar um erro se tiver faltando parametros
            if (missingParams.length > 0) {
                let errMsg = "Faltando parametros: ";
    
                for (const param of missingParams) {
                    errMsg += `${param} `;
                }
    
                throw new Error(errMsg);
            }

            next();
        } catch (err) {
            res.status(400).json({ message: err.message });           
        }
    }
}