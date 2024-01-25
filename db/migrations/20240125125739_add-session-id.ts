import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.alterTable('transactions', (table) => {
        /* 
            after = fala depois que qual row ela deve aparecer
            index = fala para o banco de dados que o campo vai ser muito usado nas buscas no where, sendo assim ele cria um cash desse campo
            para performar melhor
        */
        table.uuid('session_id').after('id').index()
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable('transactions', (table) => {
        table.dropColumn('session_id')
    })
}

