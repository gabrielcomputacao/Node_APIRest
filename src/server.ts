import fastify from "fastify";
import cookie from "@fastify/cookie";
import { transactionsRoutes } from "./routes/transactions";

const app = fastify();

// ! É importante a ordem para se trabalhar com cookie, instanciar antes das rotas que o cookie vai ser trabalhado

/* 
  todo: Aqui seria um preHandler global para todas as rotas

  app.addHook("preHandler", async (request, response) => {
    console.log("prehandler global");
  });

*/

app.register(cookie);

app.register(transactionsRoutes, {
  prefix: "transactions",
});

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log("HTTP Server Running");
  });
