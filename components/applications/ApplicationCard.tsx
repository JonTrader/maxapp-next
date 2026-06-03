import { MapPin, Calendar } from 'lucide-react'
import Link from 'next/link'
import type { SerializedApplication } from '@/lib/data'

type AiAnalysis = { matchScore?: number | null } & Record<string, unknown>

type Props = {
  application: SerializedApplication
}

function formatAppliedDate(value: string | undefined | null): string | null {
  if (!value) return null
  return new Date(value).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export default function ApplicationCard({ application }: Props) {
  const aiAnalysis = application.aiAnalysis as AiAnalysis | undefined
  const appliedDate = formatAppliedDate(application.appliedDate)

  return (
    <Link
      href={`/jobapplications/${application._id}`}
      className="card w-full cursor-pointer border border-x-base-200 bg-base-100 shadow-sm transition hover:border-white"
    >
      <div className="card-body p-4">
        <div className="items-start gap-4">
          <div>
            <h3 className="text-base font-semibold text-base-content">
              {application.company}
            </h3>
            <p className="text-sm text-base-content/70">{application.role}</p>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between text-xs text-base-content/60">
          <span><MapPin className='h-4 inline' />{application.location || 'No location'}</span>
          <span><Calendar className='h-4 inline' />{appliedDate || 'No date'}</span>
        </div>
        {aiAnalysis?.matchScore != null && (
          <div className="mt-3 flex items-center justify-between text-xs text-base-content/70">
            <span>AI Score</span>
            <span className="font-semibold">{aiAnalysis.matchScore}/100</span>
          </div>
        )}
      </div>
    </Link>
  )
}
