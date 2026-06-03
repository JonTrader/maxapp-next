import Link from 'next/link'
import { formatDate } from '@/lib/utils'

type Props = {
  resume: {
    _id: string
    targetRole?: string
    originalFilename?: string
    createdAt?: string
    aiAnalysis?: { overall_score?: number } | null
  }
}

export default function ResumeCard({ resume }: Props) {
  const matchScore = resume.aiAnalysis?.overall_score

  return (
    <Link
      href={`/resumes/${resume._id}`}
      className="rounded-xl border border-base-200 bg-base-100 p-5 text-left transition hover:border-primary/40 hover:shadow-sm"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">{resume.targetRole}</h2>
          <p className="mt-1 text-sm text-base-content/70">{resume.originalFilename}</p>
        </div>
        {matchScore != null && (
          <span className="badge badge-success badge-outline">{matchScore}% match</span>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-2 text-xs text-base-content/60">
        <span className="badge badge-outline badge-sm">Uploaded {formatDate(resume.createdAt)}</span>
      </div>

      <p className="mt-4 text-sm text-base-content/75">
        Open this resume to review the saved PDF preview and AI analysis.
      </p>
    </Link>
  )
}
