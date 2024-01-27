import { it, beforeAll, afterAll, describe, expect, beforeEach } from "vitest";
import request from "supertest";
import { app } from "../src/app";
import { execSync } from "child_process";

/* test("teste", () => {
   fazer uma chamada http, criar algo , fazer funcionar
   validação do que esta acontecendo a cima

  const responseCode = 201;

  expect(responseCode).equals(201);
}); */

/* executa apenas uma vez antes de todos os testes 

    usando ready aguarda todos os plugins cadastrados no fastify
*/

describe("Transactions routes", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    /* execSync permite executar comandos do terminal dentro do codigo da aplicação*/
    execSync("npm run knex migrate:rollback --all");
    execSync("npm run knex migrate:latest");
  });

  it.skip("user can create transaction", async () => {
    /*  o super test precisa receber o create do servidor nesse caso o app  */

    const response = await request(app.server)
      .post("/transactions")
      .send({
        title: "new transaction",
        amount: 5000,
        type: "credit",
      })
      .expect(201);
  });

  it("should be able to list all transactions", async () => {
    /* 
       qualquer teste deve se excluir do contexto de outro teste, nao deveria depender de outro teste
    */

    const createTransactionResponse = await request(app.server)
      .post("/transactions")
      .send({
        title: "new transaction",
        amount: Number(5000),
        type: "credit",
      });

    const cookies = createTransactionResponse.get("Set-Cookie");

    /* 
      o metodo set , seta uma informação no cabeçalho da requisição
    */

    const listTransactionResponse = await request(app.server)
      .get("/transactions")
      .set("Cookie", cookies)
      .expect(200);

    expect(listTransactionResponse.body.transactions).toEqual([
      expect.objectContaining({
        title: "new transaction",
        amount: Number(5000),
      }),
    ]);
  });

  it("should be able to get a specific transaction", async () => {
    /* 
       qualquer teste deve se excluir do contexto de outro teste, nao deveria depender de outro teste
    */

    const createTransactionResponse = await request(app.server)
      .post("/transactions")
      .send({
        title: "new transaction",
        amount: Number(5000),
        type: "credit",
      });

    const cookies = createTransactionResponse.get("Set-Cookie");

    /* 
      o metodo set , seta uma informação no cabeçalho da requisição
    */

    const listTransactionResponse = await request(app.server)
      .get("/transactions")
      .set("Cookie", cookies)
      .expect(200);

    const transactionId = listTransactionResponse.body.transactions[0].id;

    const getTransactionReponse = await request(app.server)
      .get(`/transactions/${transactionId}`)
      .set("Cookie", cookies)
      .expect(200);

    console.log(getTransactionReponse);
  });
});
