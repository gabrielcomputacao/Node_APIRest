
import { knex as setupKnex, Knex } from 'knex'

/* 
    Migrations
    Como se fosse um controle de versao de banco de dados
    Consegue criar um historico de alterações no banco de dados
*/

export const config: Knex.Config = {
    client: 'sqlite',
    connection: {
        filename: './db/app.db'
    },
    useNullAsDefault: true,
    migrations: {
        extension: 'ts',
        directory: './db/migrations'
    }

}

export const knex = setupKnex(config)