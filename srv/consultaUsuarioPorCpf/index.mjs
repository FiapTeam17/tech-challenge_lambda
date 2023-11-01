import * as mysql from 'mysql2/promise';
import jwt from 'jsonwebtoken';

export const handler = async (event, context) => {
    try {
        const cpf = event["cpf"];
        // Crie uma conexão com o banco de dados RDS
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_SCHEMA
        });

        // Execute uma consulta
        const [rows, fields] = await connection.execute('SELECT * FROM Cliente WHERE cpf = ' + cpf + ' LIMIT 1');

        // Encerre a conexão com o banco de dados
        await connection.end();
        
        if(rows.length > 0){
            const payload = {
                user_id: rows["id"],
                username: rows["email"]
            };
            const chaveSecreta = process.env.SECRET_KEY;
            const token = jwt.sign(payload, chaveSecreta, { expiresIn: '1h' });
            return {
                statusCode: 200,
                body: JSON.stringify(token)
            };
        }

        return {
            statusCode: 200,
            body: JSON.stringify('')
        };
    } catch (error) {
        console.error('Erro:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Ocorreu um erro ao acessar o banco de dados.' })
        };
    }
};
