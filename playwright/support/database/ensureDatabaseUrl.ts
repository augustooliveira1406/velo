export function ensureDatabaseUrl(): void {
  if (!process.env.DATABASE_URL?.trim()) {
    throw new Error(
      'DATABASE_URL não está definida. Os testes de consulta de pedido inserem dados no Postgres ' +
        'antes de buscar na UI; no CI use o secret PREVIEW_DATABASE_URL (connection string do mesmo ' +
        'projeto Supabase do preview). Localmente, configure em .env.',
    )
  }
}
