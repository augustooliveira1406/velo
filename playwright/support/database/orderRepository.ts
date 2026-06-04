import { ensureTestDatabaseAccess } from './ensureDatabaseUrl'
import { withDatabase } from './database'
import { getSupabaseAdmin } from './supabaseAdmin'

import { OrderDetails } from '../actions/orderLookupActions'

import crypto from 'crypto'

export function normalizeValue(value: string) {
  if (!value) return '';

  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '')
    .toLowerCase();
}

function buildOrderRow(order: OrderDetails) {
  return {
    id: crypto.randomUUID(),
    order_number: order.number,
    color: order.color.toLowerCase().replace(' ', '-'),
    wheel_type: order.wheels.replace(' Wheels', '').toLowerCase(),
    customer_name: order.customer.name,
    customer_email: order.customer.email,
    customer_phone: order.customer.phone,
    customer_cpf: order.customer.document,
    payment_method: normalizeValue(order.payment),
    total_price: Number(order.total_price),
    status: order.status,
    optionals: [] as string[],
  }
}

async function insertOrderViaSupabase(order: OrderDetails) {
  const supabase = getSupabaseAdmin()!
  const { error } = await supabase.from('orders').insert(buildOrderRow(order))
  if (error) throw new Error(`insertOrder: ${error.message}`)
}

async function deleteOrdersViaSupabase(filter: { column: string; value: string }) {
  const supabase = getSupabaseAdmin()!
  const { error } = await supabase.from('orders').delete().eq(filter.column, filter.value)
  if (error) throw new Error(`delete orders: ${error.message}`)
}

export async function insertOrder(order: OrderDetails) {
  ensureTestDatabaseAccess()

  if (getSupabaseAdmin()) {
    await insertOrderViaSupabase(order)
    return
  }

  const row = buildOrderRow(order)
  await withDatabase((db) =>
    db
      .insertInto('orders')
      .values({
        ...row,
        total_price: order.total_price,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .execute(),
  )
}

export async function deleteOrderByNumber(orderNumber: string) {
  ensureTestDatabaseAccess()

  if (getSupabaseAdmin()) {
    await deleteOrdersViaSupabase({ column: 'order_number', value: orderNumber })
    return
  }

  await withDatabase((db) =>
    db.deleteFrom('orders').where('order_number', '=', orderNumber).execute(),
  )
}

export async function deleteOrderByEmail(email: string) {
  ensureTestDatabaseAccess()

  if (getSupabaseAdmin()) {
    await deleteOrdersViaSupabase({ column: 'customer_email', value: email })
    return
  }

  await withDatabase((db) =>
    db.deleteFrom('orders').where('customer_email', '=', email).execute(),
  )
}
