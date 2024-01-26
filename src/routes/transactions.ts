import { FastifyInstance } from "fastify";
import { knex } from "../database";
import { randomUUID } from "crypto";
import { z } from "zod";

export async function transactionsRoutes(app: FastifyInstance) {
  app.get("/", async () => {
    const transactions = await knex("transactions").select();

    /* 
        Trabalhar com objetos é melhor para questao de resposta e requisicao(envio)
        mais facil adicionar e remvoer informações no futuro
    */
    return { transactions };
  });

  app.get("/:id", async (request) => {
    const getTransactionsParamsSchema = z.object({
      id: z.string().uuid(),
    });

    const { id } = getTransactionsParamsSchema.parse(request.params);

    /* 
        funcao first informa ao knex que é apenas um dado que vai ser retorna, assim ele nao retorna um array
    */
    const transaction = await knex("transactions").where("id", id).first();

    return { transaction };
  });

  app.get("/summary", async () => {
    /* 
        sem o first o knex retorna um array
    */

    const summary = await knex("transactions")
      .sum("amount", { as: "amount" })
      .first();

    return { summary };
  });

  app.post("/", async (request, response) => {
    const createTransactionBodySchema = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(["credit", "debit"]),
    });

    /*  Parse retorna um throw */
    const { amount, title, type } = createTransactionBodySchema.parse(
      request.body
    );

    await knex("transactions").insert({
      id: randomUUID(),
      titlle: title,
      amount: type === "credit" ? amount : amount * -1,
    });

    return response.status(201).send();
  });

  /* rota de TESTE */
  app.get("/hello", async () => {
    /* 
               inserção
           
            const transaction = await knex('transactions').insert({
               id: crypto.randomUUID(),
               titlle: 'transação teste',
               amount: 1000,
             }).returning('*') 
             
             */

    const transactions = await knex("transactions").select("*");

    return transactions;
  });
}
