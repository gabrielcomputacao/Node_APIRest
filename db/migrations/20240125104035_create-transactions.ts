import type { Knex } from "knex";

/* o que a migration vai fazer */
export async function up(knex: Knex): Promise<void> {

    await knex.schema.createTable('transactions', (table) => {
        table.uuid('id').primary()
        table.text('titlle').notNullable()
        /* 10 - tamanho do dado
            2 - numero de casas decimais
        */
        table.decimal('amount', 10, 2).notNullable()
        table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable()
    })

}

/*  o contrario do que o up fez, como remover,deletar */
export async function down(knex: Knex): Promise<void> {

    await knex.schema.dropTable('transactions')
}



