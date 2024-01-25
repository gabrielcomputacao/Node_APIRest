import 'dotenv/config'
import { knex as setupKnex, Knex } from 'knex'

/* 
    Migrations
    Como se fosse um controle de versao de banco de dados
    Consegue criar um historico de alterações no banco de dados
*/

if (!process.env.DATABASE_URL) {
    throw new Error('database_url not found.')
}

export const config: Knex.Config = {
    client: 'sqlite',
    connection: {
        filename: process.env.DATABASE_URL,
    },
    useNullAsDefault: true,
    migrations: {
        extension: 'ts',
        directory: './db/migrations'
    }

}

export const knex = setupKnex(config)