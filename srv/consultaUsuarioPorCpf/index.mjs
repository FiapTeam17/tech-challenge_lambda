import * as mysql from 'mysql2/promise';
import jwt from 'jsonwebtoken';

export const handler = async (event, context) => {
    try {
        const cpf = event["cpf"];
        console.log(cpf);
        // Recupere as informações de conexão do ambiente
        const dbEndpoint = "tech-challenge-v2.cu7yj3gjjks1.us-east-2.rds.amazonaws.com";
        const dbUsername = "admin";
        const dbPassword = "12345678";
        const dbName = "sgr_database";

        // Crie uma conexão com o banco de dados RDS
        const connection = await mysql.createConnection({
            host: dbEndpoint,
            user: dbUsername,
            password: dbPassword,
            database: dbName
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
            const chaveSecreta = 'chave-secreta-super-segura';
            const token = jwt.sign(payload, chaveSecreta, { expiresIn: '1h' });
            return {
                statusCode: 200,
                body: JSON.stringify(token)
            };
        }
    } catch (error) {
        console.error('Erro:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Ocorreu um erro ao acessar o banco de dados.' })
        };
    }
};
