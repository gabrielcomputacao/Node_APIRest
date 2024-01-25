import fastify from 'fastify'
import { knex } from './database'
import crypto from 'node:crypto'

const app = fastify()

app.get('/hello', async () => {

  /* 
     inserção
 
  const transaction = await knex('transactions').insert({
     id: crypto.randomUUID(),
     titlle: 'transação teste',
     amount: 1000,
   }).returning('*') 
   
   */

  const transactions = await knex('transactions').select('*')

  return transactions


})

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log('HTTP Server Running')
  })


