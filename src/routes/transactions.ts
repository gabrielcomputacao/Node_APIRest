import { FastifyInstance } from "fastify";
import { knex } from "../database";
import { randomUUID } from "crypto";
import { z } from "zod";
import { CheckSessionIdExists } from "../middlewares/check-session-id-exist";

//  todo: Cookies -> formas da gente manter o contexto entre requisições

export async function transactionsRoutes(app: FastifyInstance) {
  app.get(
    "/",
    // todo: preHandler sao funcoes que sao executadas antes de executar o handler, para verificações ou autenticações
    {
      preHandler: [CheckSessionIdExists],
    },
    async (request, response) => {
      const { sessionId } = request.cookies;

      const transactions = await knex("transactions")
        .where("session_id", sessionId)
        .select();

      /* 
        Trabalhar com objetos é melhor para questao de resposta e requisicao(envio)
        mais facil adicionar e remvoer informações no futuro
    */
      return { transactions };
    }
  );

  app.get(
    "/:id",
    {
      preHandler: [CheckSessionIdExists],
    },
    async (request) => {
      const getTransactionsParamsSchema = z.object({
        id: z.string().uuid(),
      });

      const { id } = getTransactionsParamsSchema.parse(request.params);

      const { sessionId } = request.cookies;

      /* 
        funcao first informa ao knex que é apenas um dado que vai ser retorna, assim ele nao retorna um array
    */
      const transaction = await knex("transactions")
        .where("id", id)
        .andWhere("session_id", sessionId)
        .first();

      return { transaction };
    }
  );

  app.get(
    "/summary",
    {
      preHandler: [CheckSessionIdExists],
    },
    async (request) => {
      const { sessionId } = request.cookies;

      /* 
        sem o first o knex retorna um array
    */

      const summary = await knex("transactions")
        .sum("amount", { as: "amount" })
        .where("session_id", sessionId)
        .first();

      return { summary };
    }
  );

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

    let sessionId = request.cookies.sessionId;

    if (!sessionId) {
      sessionId = randomUUID();

      /* 
            Salva nos cookie o nome do cookie e o dado que foi criado como um uuiD nesse caso
        */
      response.cookie("sessionId", sessionId, {
        /* rotas que podem acessar esse cookie dentro do backend */
        path: "/",
        /* tem que passar em segundos segundo a documentação do fastify para falar o tempo de expiração do cookie 

                1000 milisegundos sao 1 segundos
                60 segundos sao 1 minutos
                60 minutos sao 1 hora
                24 horas sao 1 dia
            */
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });
    }

    await knex("transactions").insert({
      id: randomUUID(),
      titlle: title,
      amount: type === "credit" ? amount : amount * -1,
      session_id: sessionId,
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
