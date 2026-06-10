import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import AIAnalysisPanel from '@/components/resumes/AIAnalysisPanel'
import DeleteResumeModal from '@/components/resumes/DeleteResumeModal'
import { getSession } from '@/lib/auth/auth'
import { getResume } from '@/lib/data'
import { formatDate } from '@/lib/utils'

type SectionScore = {
  score?: number
  recommendations?: string[]
}

type AtsCompatibility = SectionScore & {
  present_keywords?: string[]
  missing_keywords?: string[]
}

type GapsAndFlags = {
  flags?: string[]
  recommendations?: string[]
}

type Analysis = {
  overall_score?: number
  overall_summary?: string
  relevance?: SectionScore
  impact_and_quantification?: SectionScore
  ats_compatibility?: AtsCompatibility
  gaps_and_red_flags?: GapsAndFlags
  top_3_priorities?: string[]
  competitive_assessment?: string
}

export default async function ResumePage(props: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) return null

  const params = await props.params
  const { id: resumeId } = params
  const resume = await getResume(resumeId, session.user.id)

  if (!resume) {
    return (
      <div className="min-h-screen bg-base-200">
        <main className="mx-auto max-w-5xl px-4 py-12">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold">Resume not found</h1>
            <Link href="/resumes" className="btn btn-primary btn-sm gap-2 hover:border-white">
              <ChevronLeft className="h-4 w-4" />
              Back to Resumes
            </Link>
          </div>
        </main>
      </div>
    )
  }

  const uploadedDate = formatDate(resume.createdAt)
  const previewUrl = resume.cloudinaryUrl || ''
  const analysis: Analysis = (resume.aiAnalysis || {}) as Analysis
  const matchScore = analysis.overall_score

  return (
    <div className="min-h-screen bg-base-200">
      <main className="mx-auto max-w-5xl px-4 py-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="space-y-2">
            <Link
              href="/resumes"
              className="btn gap-2 btn-primary hover:border-white"
            >
              <ChevronLeft className="h-4 w-4" />
              Back to Resumes
            </Link>
            <div className="mt-6">
              <h1 className="text-2xl font-semibold">
                {resume.targetRole || 'Resume Details'}
              </h1>
              <p className="mt-2 text-sm text-base-content/70">
                Review the saved PDF preview and AI analysis for this resume.
              </p>
              <div className="mt-3 flex flex-wrap gap-2 text-sm">
                {uploadedDate && <span className="badge badge-outline">Uploaded {uploadedDate}</span>}
                {resume.originalFilename && <span className="badge badge-outline">{resume.originalFilename}</span>}
                {matchScore != null && (
                  <span className="badge badge-success badge-outline">{matchScore}% match</span>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 md:justify-end">
            <DeleteResumeModal resumeId={resumeId} />
          </div>
        </div>

        <section className="mt-6 rounded-xl border border-base-200 bg-base-100 p-6">
          <div className="rounded-xl border border-base-200 bg-base-100 p-4">
            <h2 className="text-lg font-semibold">PDF Preview</h2>
            {previewUrl ? (
              <div>
                <iframe
                  title="Resume PDF preview"
                  src={previewUrl}
                  className="mt-3 h-120 w-full rounded-lg border border-base-300"
                />
                <p className="mt-2 text-xs text-base-content/60">
                  Free plan limitation: PDF may not display in preview.{' '}
                  <a
                    href={previewUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="link link-primary"
                  >
                    Open in new tab
                  </a>
                </p>
              </div>
            ) : (
              <div className="mt-3 flex h-72 items-center justify-center rounded-lg border border-dashed border-base-300 bg-base-200/30 p-4 text-center text-sm text-base-content/60">
                <div>
                  <p className="font-medium">Preview unavailable</p>
                  <p className="mt-1 text-xs">This resume does not have a preview URL.</p>
                </div>
              </div>
            )}
          </div>
        </section>

        <section className="mt-6">
          <AIAnalysisPanel analysis={analysis} />
        </section>
      </main>
    </div>
  )
}
