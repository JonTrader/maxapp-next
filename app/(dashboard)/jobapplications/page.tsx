import { getSession } from '@/lib/auth/auth'
import {
  fetchLatestApplicationsByStatus,
  fetchTodayAppliedCount,
  STATUS_OPTIONS,
  type StatusKey,
} from '@/lib/data'
import AddApplicationModal from '@/components/applications/AddApplicationModal'
import DailyProgressBar from '@/components/applications/DailyProgressBar'
import StatusColumn from '@/components/applications/StatusColumn'

const ACTIVE_KEYS: StatusKey[] = ['applied', 'interview', 'offer']

export default async function JobApplications() {
  const session = await getSession()
  if (!session) return null

  const [response, todayCount] = await Promise.all([
    fetchLatestApplicationsByStatus(session.user.id),
    fetchTodayAppliedCount(session.user.id),
  ])

  const summary = STATUS_OPTIONS.reduce(
    (acc, status) => {
      const key = status.toLowerCase() as StatusKey
      const total = response?.[key]?.total ?? 0
      acc.total += total
      if (ACTIVE_KEYS.includes(key)) acc.active += total
      if (key === 'offer') acc.offers = total
      return acc
    },
    { total: 0, active: 0, offers: 0 },
  )

  return (
    <div className="min-h-screen bg-base-200">
      <main className="mx-auto w-full px-4 py-8">
        <div className="flex gap-5 flex-row md:items-end justify-between lg:w-4/5 lg:mx-auto">
          <div>
            <h2 className="text-2xl font-semibold">Your Applications</h2>
            <div className="mt-2 flex flex-wrap gap-2 text-sm">
              <span className="badge badge-outline badge-sm">{summary.total} Total</span>
              <span className="badge badge-outline badge-sm">{summary.active} Active</span>
              <span className="badge badge-outline badge-sm">{summary.offers} Offers</span>
            </div>
          </div>
          <AddApplicationModal />
        </div>

        <DailyProgressBar todayCount={todayCount} />

        <div className="mt-8 grid gap-4 sm:grid-cols-3 xl:grid-cols-5">
          {STATUS_OPTIONS.map((status) => (
            <StatusColumn
              key={status}
              status={status}
              bucket={
                response?.[status.toLowerCase() as StatusKey] ?? { total: 0, items: [] }
              }
            />
          ))}
        </div>
      </main>
    </div>
  )
}
