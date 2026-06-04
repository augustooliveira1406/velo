import { closeDatabase } from './support/database/database'

export default async function globalTeardown() {
  await closeDatabase()
}
