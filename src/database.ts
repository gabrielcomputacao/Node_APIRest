import { knex as setupKnex, Knex } from "knex";
import { env } from "./env";

/* 
    Migrations
    Como se fosse um controle de versao de banco de dados
    Consegue criar um historico de alterações no banco de dados
*/

export const config: Knex.Config = {
  client: env.DATABASE_CLIENT,
  connection:
    env.DATABASE_CLIENT === "sqlite"
      ? {
          filename: env.DATABASE_URL,
        }
      : env.DATABASE_URL,
  useNullAsDefault: true,
  migrations: {
    extension: "ts",
    directory: "./db/migrations",
  },
};

export const knex = setupKnex(config);
