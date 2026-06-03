import Link from 'next/link'
import { redirect } from 'next/navigation'
import { FileText, Plus } from 'lucide-react'

import { getSession } from '@/lib/auth/auth'
import { fetchResumes } from '@/lib/data'
import PaginationControls from '@/components/ui/PaginationControls'
import FeedbackMessage from '@/components/ui/FeedbackMessage'
import ResumeCard from '@/components/resumes/ResumeCard'

const PAGE_SIZE = 10

type PageProps = {
  searchParams: Promise<{ page?: string }>
}

export default async function ResumeListPage({ searchParams }: PageProps) {
  const session = await getSession()
  if (!session) redirect('/login')

  const { page: pageParam } = await searchParams
  const parsedPage = parseInt(pageParam || '1', 10)
  const currentPage = Number.isNaN(parsedPage) ? 1 : Math.max(1, parsedPage)

  const result = await fetchResumes(session.user.id, currentPage, PAGE_SIZE)

  const items = result?.items ?? []
  const pagination =
    result?.pagination ?? {
      page: currentPage,
      limit: PAGE_SIZE,
      total: 0,
      totalPages: 1,
      hasNext: false,
      hasPrev: false
    }

  const resumeCountLabel = `${pagination.total} ${pagination.total === 1 ? 'resume' : 'resumes'}`

  return (
    <div className="min-h-screen bg-base-200">
      <main className="mx-auto px-4 py-8 lg:max-w-6xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Resume Library</h1>
            <p className="mt-2 text-sm text-base-content/70">
              Review previously analyzed resumes or upload a new one.
            </p>
            <div className="mt-3">
              <span className="badge badge-outline badge-sm">{resumeCountLabel}</span>
            </div>
          </div>

          <Link
            href="/resumes/create"
            className="btn btn-primary gap-2 hover:border-white"
          >
            <Plus className="h-4 w-4" />
            Upload New Resume
          </Link>
        </div>

        {!result ? (
          <div className="mt-8">
            <FeedbackMessage type="error" message="Unable to load resumes." />
          </div>
        ) : items.length === 0 ? (
          <section className="mt-8 rounded-xl border border-dashed border-base-300 bg-base-100 p-8 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-base-200">
              <FileText className="h-6 w-6 text-base-content/60" />
            </div>
            <h2 className="mt-4 text-lg font-semibold">No resumes uploaded yet</h2>
            <p className="mt-2 text-sm text-base-content/70">
              Upload your first resume to save the PDF and AI analysis for later review.
            </p>
            <Link
              href="/resumes/create"
              className="btn btn-primary mt-6 gap-2 hover:border-white"
            >
              <Plus className="h-4 w-4" />
              Upload Your First Resume
            </Link>
          </section>
        ) : (
          <>
            <div className="mt-8 grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
              {items.map((resume) => (
                <ResumeCard key={resume._id} resume={resume} />
              ))}
            </div>

            {items.length > 0 && (
              <PaginationControls
                pagination={pagination}
                baseUrl="/resumes"
                itemsLength={items.length}
              />
            )}
          </>
        )}
      </main>
    </div>
  )
}
