import * as mysql from 'mysql2/promise';
import jwt from 'jsonwebtoken';

export const handler = async (event, context) => {
    let connection;

    try {
        const body = JSON.parse(event.body);
        // Crie uma conexão com o banco de dados RDS
        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_SCHEMA
        });

        // Execute uma consulta
        const [rows, fields] = await connection.execute('SELECT * FROM Cliente WHERE cpf = ' + body.cpf + ' LIMIT 1');

        if (rows.length > 0) {
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
            body: JSON.stringify({})
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Ocorreu um erro ao acessar o banco de dados.' })
        };
    } finally {
        await connection.end();
    }
};
