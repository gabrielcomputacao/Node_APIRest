import fastify from "fastify";
import cookie from "@fastify/cookie";
import crypto from "node:crypto";
import { transactionsRoutes } from "./routes/transactions";

const app = fastify();

// ! É importante a ordem para se trabalhar com cookie, instanciar antes das rotas que o cookie vai ser trabalhado

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
