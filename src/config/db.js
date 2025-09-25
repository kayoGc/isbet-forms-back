import mongoose from "mongoose";

/**
 * Vai conectar com o baco de dados mongoDB
 */
const connectDb = async () => {
    try {
        // tenta fazer a conexão
        await mongoose.connect(process.env.DB_URI);

        console.log("\nBanco de dados conectado com sucesso");
    } catch (err) {
        // caso a conexão falhar
        console.error("Erro conectando com o banco de dados:", err.message);
    }
} 

export default connectDb;