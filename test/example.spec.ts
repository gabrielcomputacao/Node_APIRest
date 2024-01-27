import { test, beforeAll, afterAll } from "vitest";
import request from "supertest";
import { app } from "../src/app";

/* test("teste", () => {
   fazer uma chamada http, criar algo , fazer funcionar
   validação do que esta acontecendo a cima

  const responseCode = 201;

  expect(responseCode).equals(201);
}); */

/* executa apenas uma vez antes de todos os testes 

    usando ready aguarda todos os plugins cadastrados no fastify
*/
beforeAll(async () => {
  await app.ready();
});

afterAll(async () => {
  await app.close();
});

test("usuario criando nova transação", async () => {
  /*  o super test precisa receber o create do servidor nesse caso o app  */

  await request(app.server)
    .post("/transactions")
    .send({
      title: "new transaction",
      amount: 5000,
      type: "credit",
    })
    .expect(201);
});
