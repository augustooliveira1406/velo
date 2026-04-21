import 'dotenv/config'
import pg from 'pg'

const { Client } = pg

async function testConnection() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL não definida')
  }

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  })

  try {
    await client.connect()
    const res = await client.query('SELECT NOW()')
    console.log('✅ Conectado:', res.rows[0])
  } catch (err) {
    console.error('❌ Erro real:', err)
  } finally {
    await client.end()
  }
}

testConnection()