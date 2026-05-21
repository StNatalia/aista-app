import { supabaseAdmin } from '@/lib/supabase'
import { OrderRow, OrderStatus } from '@/types'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

type Search = { [k: string]: string | string[] | undefined }

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<Search>
}) {
  const params = await searchParams
  const key = typeof params.key === 'string' ? params.key : ''
  const expected = process.env.ADMIN_PASSWORD

  if (!expected || key !== expected) {
    return <Locked />
  }

  let orders: OrderRow[] = []
  let totalRevenue = 0
  let counts: Partial<Record<OrderStatus, number>> = {}
  let error: string | null = null

  try {
    const { data, error: dbError } = await supabaseAdmin()
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100)

    if (dbError) throw dbError
    orders = (data ?? []) as OrderRow[]

    for (const o of orders) {
      counts[o.status] = (counts[o.status] ?? 0) + 1
      if (o.status === 'completed' || o.status === 'paid') {
        totalRevenue += Number(o.amount_eur ?? 9)
      }
    }
  } catch (e) {
    if (e instanceof Error) {
      error = e.message
    } else if (e && typeof e === 'object') {
      error = JSON.stringify(e)
    } else {
      error = String(e)
    }
  }

  return (
    <main className="min-h-screen bg-cream-2/40 p-6 sm:p-10">
      <div className="max-w-6xl mx-auto">
        <header className="flex items-baseline justify-between mb-8 flex-wrap gap-3">
          <div>
            <h1 className="font-display text-3xl text-ink">AISTA · Admin</h1>
            <p className="text-sm text-muted mt-1">
              Останні 100 замовлень · оновлюється на кожне відкриття
            </p>
          </div>
          <a
            href="/"
            className="text-sm text-muted underline underline-offset-2 hover:text-ink"
          >
            ← На сайт
          </a>
        </header>

        {error && (
          <div className="rounded-2xl bg-clay-soft/40 text-clay p-4 mb-6 text-sm">
            <strong>Помилка БД:</strong> {error}
            <div className="mt-2 text-xs text-ink-soft">
              Перевір .env.local — NEXT_PUBLIC_SUPABASE_URL і
              SUPABASE_SERVICE_ROLE_KEY повинні бути встановлені.
            </div>
          </div>
        )}

        {/* KPI tiles */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-8">
          <KpiTile label="Всього" value={orders.length} />
          <KpiTile label="Оплачено" value={(counts.paid ?? 0) + (counts.completed ?? 0)} accent="sage" />
          <KpiTile label="Очікують" value={counts.pending ?? 0} />
          <KpiTile label="Помилки" value={counts.failed ?? 0} accent="clay" />
          <KpiTile label="Виручка" value={`€${totalRevenue.toFixed(0)}`} accent="forest" />
        </div>

        {/* Orders table */}
        <div className="bg-white rounded-3xl ring-1 ring-ink/5 card-shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-cream-2/60 text-xs uppercase tracking-wider text-muted">
                <tr>
                  <Th>Дата</Th>
                  <Th>Клієнт</Th>
                  <Th>Профессія</Th>
                  <Th>Регіон · мова</Th>
                  <Th>Статус</Th>
                  <Th>Сума</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/5">
                {orders.length === 0 && !error && (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-muted">
                      Поки жодної заявки. Як з&apos;явиться — побачиш тут.
                    </td>
                  </tr>
                )}
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-cream-2/30 transition">
                    <Td>
                      <div className="text-ink">{fmtDate(o.created_at)}</div>
                      <div className="text-xs text-muted">{fmtTime(o.created_at)}</div>
                    </Td>
                    <Td>
                      <div className="font-medium text-ink">{o.full_name}</div>
                      <div className="text-xs text-muted">{o.email}</div>
                    </Td>
                    <Td>
                      <div className="text-ink">{o.profession_id ?? '—'}</div>
                      <div className="text-xs text-muted">{o.track ?? ''}</div>
                    </Td>
                    <Td>
                      <div className="text-ink">{o.region ?? '—'}</div>
                      <div className="text-xs text-muted">{(o.output_language ?? '').toUpperCase()}</div>
                    </Td>
                    <Td>
                      <StatusBadge status={o.status} />
                      {o.error_message && (
                        <div className="text-xs text-clay mt-1 max-w-xs truncate" title={o.error_message}>
                          {o.error_message}
                        </div>
                      )}
                    </Td>
                    <Td className="text-ink">€{Number(o.amount_eur ?? 9).toFixed(0)}</Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  )
}

function Locked() {
  return (
    <main className="min-h-screen bg-cream flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-3xl ring-1 ring-ink/5 card-shadow p-8 text-center">
        <h1 className="font-display text-2xl text-ink">Доступ обмежено</h1>
        <p className="text-sm text-muted mt-2">
          Додай <code className="bg-cream-2 px-1.5 py-0.5 rounded">?key=ТВІЙ_ПАРОЛЬ</code> у URL.
          Пароль задається змінною ADMIN_PASSWORD в .env.local.
        </p>
      </div>
    </main>
  )
}

function KpiTile({
  label,
  value,
  accent,
}: {
  label: string
  value: string | number
  accent?: 'sage' | 'clay' | 'forest'
}) {
  const colorMap = {
    sage: 'text-sage-dark',
    clay: 'text-clay',
    forest: 'text-forest',
  }
  const color = accent ? colorMap[accent] : 'text-ink'
  return (
    <div className="bg-white rounded-2xl ring-1 ring-ink/5 p-4">
      <div className="text-xs text-muted">{label}</div>
      <div className={`font-display text-2xl ${color}`}>{value}</div>
    </div>
  )
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-4 py-3 text-left font-medium whitespace-nowrap">
      {children}
    </th>
  )
}

function Td({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  return <td className={`px-4 py-3 align-top ${className}`}>{children}</td>
}

function StatusBadge({ status }: { status: OrderStatus }) {
  const styles: Record<OrderStatus, string> = {
    pending: 'bg-cream-2 text-muted',
    paid: 'bg-sage-light/60 text-sage-dark',
    generating: 'bg-clay-soft/50 text-clay',
    completed: 'bg-forest text-cream',
    failed: 'bg-clay text-cream',
  }
  const labels: Record<OrderStatus, string> = {
    pending: 'очікує',
    paid: 'оплачено',
    generating: 'генерується',
    completed: 'готово',
    failed: 'помилка',
  }
  return (
    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
      {labels[status]}
    </span>
  )
}

function fmtDate(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString('uk-UA', { day: '2-digit', month: 'short' })
}
function fmtTime(iso: string) {
  const d = new Date(iso)
  return d.toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' })
}
