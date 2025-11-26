/**
 * Essa função cria um middleware que vai checar o corpo das requisições,
 * se não estiver adequado impede de continuar a requisição
 * @param {Object} requiredData As chaves são os nomes do parametro e seu valor é o seu tipo
 */
export const createCheckMd = (requiredData) => {

    // retorna uma função middleware que tem acesso a requiredData
    return (req, res, next) => {
        try {
            if (!req.body) {
                throw new Error("Nenhum dado mandado na requisição.");
            }

            let errMsg = '';

            // IDEIA: analisar também os tipos de items que o array terá,
            // e em objetos permitir especificar a chave e o tipo da chave também
            // creio que seria melhor com uma função recursiva mas custaria processamento 
            for (const [key, type] of Object.entries(requiredData)) {
                // key é o nome da chave no body, e type é o tipo que o valor deve ter
                // só em arrays que o caso é diferente que vem um array em vez de string
                const param = req.body[key];

                if (param === undefined)  {
                    errMsg += ` faltando ${key} |`;
                    continue;
                }

                if (Array.isArray(type)) {
                    if (!Array.isArray(param)) {
                        errMsg += ` ${key} deve ser array |`;
                    }

                    continue;
                }

                // a parte depois do || certifica que quando querendo um objeto não aceite um array (js classifica arrays como object também)
                if (typeof param !== type || type === "object" && Array.isArray(param)) {
                    errMsg += ` ${key} deve ser ${type} |`;
                }
            }

            console.log(errMsg, req.body);
    
            if (errMsg !== '') {
                // formata mensagem, tira ultimo '|' e os espaços no começo e fim
                errMsg = errMsg.slice(0, errMsg.length - 1).trim();

                throw new Error(errMsg);
            }

            next();
        } catch (err) {
            res.status(400).json({ message: err.message });           
        }
    }

}