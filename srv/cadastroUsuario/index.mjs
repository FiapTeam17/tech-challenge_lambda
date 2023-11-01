import * as mysql from "mysql2/promise";

export const handler = async (event, context) => {
    const connection = null;

    try {
        const jsonInsert = {
            nome: event["nome"],
            cpf: event["cpf"],
            email: event["email"],
        };

        // Crie uma conexão com o banco de dados RDS
        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_SCHEMA,
        });

        // Execute uma consulta
        const [result] = await connection.execute(
            "INSERT INTO Cliente (nome, cpf, email) VALUES (?, ?, ?)",
            [jsonInsert.nome, jsonInsert.cpf, jsonInsert.email]
        );
    } catch (error) {
        console.error("Erro:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: "Ocorreu um erro ao acessar o banco de dados.",
            }),
        };
    } finally {
        await connection.end();
    }
};
