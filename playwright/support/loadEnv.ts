import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')

let loaded = false

/** Carrega .env só localmente; no CI usa apenas variáveis do workflow (secrets). */
export function loadTestEnv(): void {
  if (loaded || process.env.CI) return

  dotenv.config({
    path: path.join(rootDir, '.env'),
    override: false,
    quiet: true,
  })
  loaded = true
}
