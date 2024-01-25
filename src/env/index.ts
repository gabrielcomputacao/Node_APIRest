import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'test', 'production']).default('production'),
    DATABASE_URL: z.string(),
    PORT: z.number().default(3333)

})


/* 
    o metodo parse/safeParse vai no zod e passa a verificação sobre o parametro que foi colocado no parse
    Nesse caso o zod compara o schema criado com o process.env
    se o process.env tem todos os campos que foram colocados no schema

    se estiver correto o codigo continua se estiver errado ele retorna um erro

*/

const _env = envSchema.safeParse(process.env)

if (_env.success === false) {
    console.error(' Invalid environment variables!', _env.error.format())

    throw new Error('Invalid environment variables.')

}

export const env = _env.data
