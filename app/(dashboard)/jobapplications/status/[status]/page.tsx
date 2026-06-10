import Link from 'next/link'
import { getSession } from '@/lib/auth/auth'
import { fetchApplicationsByStatus, type SerializedApplication } from '@/lib/data'
import { normalizeStatus } from '@/lib/constants'
import ApplicationCard from '@/components/applications/ApplicationCard'
import PaginationControls from '@/components/ui/PaginationControls'
import FeedbackMessage from '@/components/ui/FeedbackMessage'
import { ChevronLeft } from 'lucide-react'

const PAGE_SIZE = 20

type PageProps = {
  params: Promise<{ status: string }>
  searchParams: Promise<{ page?: string }>
}

export default async function StatusPage({ params, searchParams }: PageProps) {
  const session = await getSession()
  if (!session) return null

  const { status } = await params
  const { page: pageParam } = await searchParams

  const canonicalStatus = normalizeStatus(status)
  const isValidStatus = canonicalStatus !== null

  const parsedPage = parseInt(pageParam || '1', 10)
  const currentPage = Number.isNaN(parsedPage) ? 1 : Math.max(1, parsedPage)

  let items: SerializedApplication[] = []
  let pagination = {
    page: 1,
    limit: PAGE_SIZE,
    total: 0,
    totalPages: 1,
    hasNext: false,
    hasPrev: false,
  }
  let errorMessage: string | null = null

  if (isValidStatus) {
    const result = await fetchApplicationsByStatus(
      session.user.id,
      canonicalStatus,
      currentPage,
      PAGE_SIZE
    )

    if (result) {
      items = result.items
      pagination = result.pagination
    } else {
      errorMessage = 'Unable to load applications for this status'
    }
  }

  return (
    <div className="min-h-screen bg-base-200">
      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold">
              {canonicalStatus || 'Status'} Applications
            </h2>
            <p className="mt-1 text-sm text-base-content/70">
              Page {pagination.page} of {pagination.totalPages} · {pagination.total} total
            </p>
          </div>
          <Link
            href="/jobapplications"
            className="btn btn-primary btn-sm gap-2 hover:border-white"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </div>

        {!isValidStatus ? (
          <FeedbackMessage 
            type="error" 
            message="Invalid status. Please return to your dashboard and select a valid status." 
          />
        ) : errorMessage ? (
          <FeedbackMessage 
            type="error" 
            message={errorMessage} 
          />
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {items.map((application: SerializedApplication) => (
                <ApplicationCard key={application._id} application={application} />
              ))}
            </div>

            {items.length === 0 && (
              <div className="mt-4">
                <FeedbackMessage 
                  type="empty" 
                  message={`No applications found for ${canonicalStatus}.`} 
                />
              </div>
            )}

            {items.length > 0 && (
              <PaginationControls
                pagination={pagination}
                baseUrl={`/jobapplications/status/${status}`}
                itemsLength={items.length}
              />
            )}
          </>
        )}
      </main>
    </div>
  )
}
