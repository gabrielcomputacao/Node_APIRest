import { config } from "dotenv";
import { z } from "zod";

if (process.env.NODE_ENV === "test") {
  config({ path: ".env.test" });
} else {
  config();
}

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("production"),
  DATABASE_CLIENT: z.enum(["sqlite", "pg"]),
  DATABASE_URL: z.string(),
  /* nao interessa o valor recebido o coerce transforma em numbero e se nao der certo o padrao é 3333 */
  PORT: z.coerce.number().default(3333),
});

/* 
    o metodo parse/safeParse vai no zod e passa a verificação sobre o parametro que foi colocado no parse
    Nesse caso o zod compara o schema criado com o process.env
    se o process.env tem todos os campos que foram colocados no schema

    se estiver correto o codigo continua se estiver errado ele retorna um erro

*/

const _env = envSchema.safeParse(process.env);

if (_env.success === false) {
  console.error(" Invalid environment variables!", _env.error.format());

  throw new Error("Invalid environment variables.");
}

export const env = _env.data;
