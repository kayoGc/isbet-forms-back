import mongoose from "mongoose";

/**
 * Vai conectar com o baco de dados mongoDB
 */
const connectDb = async () => {
    // tenta fazer a conexão
    await mongoose.connect(process.env.DB_URI);

    console.log("\nBanco de dados conectado com sucesso");
} 
export default connectDb;