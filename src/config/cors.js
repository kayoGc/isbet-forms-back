// configuração do cors

const whitoutAuthRoutes = []

// vai usar configurações diferentes depedendo da rota
const dynamicCorsConfig = (req, callback) => {
    let corsOptions;

    corsOptions = {
        origin: process.env.ORIGIN, // permite apenas um dominio especifico acessar
        credentials: true, // libera cookies e coisas relecionadas a credenciais
    };

    callback(null, corsOptions);
}

export default dynamicCorsConfig;