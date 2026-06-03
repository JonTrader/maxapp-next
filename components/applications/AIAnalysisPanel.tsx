"use client";

import { Clipboard, Check } from 'lucide-react'
import { useMemo, useState } from 'react'

interface AtsSection {
  present?: string[]
  missing?: string[]
  score?: number
}

interface AIAnalysisProps {
  matchScore?: number
  overall_summary?: string
  ats?: AtsSection
  resumeSuggestions?: string[]
  coverLetterDraft?: string
  top_priorities?: string[]
}

export default function AIAnalysisPanel({ analysis }: { analysis: AIAnalysisProps }) {
  const [copied, setCopied] = useState(false)

  const matchScore = analysis?.matchScore ?? 0
  const overallSummary = analysis?.overall_summary ?? ''
  const ats = analysis?.ats ?? {}
  const resumeSuggestions = analysis?.resumeSuggestions ?? []
  const coverLetterDraft = analysis?.coverLetterDraft ?? ''
  const topPriorities = analysis?.top_priorities ?? []

  const showEmpty = !analysis || Object.keys(analysis).length === 0

  const copyDraft = async () => {
    if (!coverLetterDraft) return
    await navigator.clipboard.writeText(coverLetterDraft)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 2000)
  }

  const scorePercentage = useMemo(() => {
    const val = Number(matchScore)
    if (Number.isNaN(val)) return 0
    return Math.max(0, Math.min(100, val))
  }, [matchScore])

  const atsScore = useMemo(() => {
    const val = Number(ats.score ?? 0)
    if (Number.isNaN(val)) return 0
    return Math.max(0, Math.min(100, val))
  }, [ats.score])

  if (showEmpty) {
    return (
      <div className="rounded-xl border border-base-200 bg-base-100 p-6 text-center">
        <p className="text-sm text-base-content/70">No AI analysis yet. Run analysis to get insights.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 rounded-xl border border-base-200 bg-base-100 p-6">
      <div>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">AI Analysis</h3>
          <span className="text-sm text-base-content/60">Match Score</span>
        </div>
        <div className="mt-2 flex items-center gap-3">
          <div className="h-2 w-full overflow-hidden rounded-full bg-base-200">
            <div
              className="h-full rounded-full bg-success"
              style={{ width: `${scorePercentage}%` }}
            />
          </div>
          <span className="text-sm font-semibold">{scorePercentage}%</span>
        </div>
        {overallSummary && <p className="mt-3 text-sm text-base-content/80">{overallSummary}</p>}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold">ATS Keywords</h4>
            <span className="text-xs text-base-content/60">Score: {atsScore}%</span>
          </div>
          <div className="mt-2 text-sm font-medium">Present</div>
          <div className="mt-1 flex flex-wrap gap-2">
            {(ats.present ?? []).length ? (
              ats.present!.map((keyword, idx) => (
                <span key={`${keyword}-${idx}`} className="badge badge-outline badge-sm max-w-[200px] truncate">
                  {keyword}
                </span>
              ))
            ) : (
              <span className="text-sm text-base-content/60">No overlap detected.</span>
            )}
          </div>

          <div className="mt-3 text-sm font-medium">Missing</div>
          <div className="mt-1 flex flex-wrap gap-2">
            {(ats.missing ?? []).length ? (
              ats.missing!.map((keyword, idx) => (
                <span key={`${keyword}-${idx}`} className="badge badge-outline badge-sm badge-warning text-warning max-w-[200px] truncate">
                  {keyword}
                </span>
              ))
            ) : (
              <span className="text-sm text-base-content/60">No missing keywords identified.</span>
            )}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold">Resume suggestions</h4>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-base-content/80">
            {resumeSuggestions.length ? (
              resumeSuggestions.map((line, idx) => <li key={`${line}-${idx}`}>{line}</li>)
            ) : (
              <li>No suggestions yet.</li>
            )}
          </ul>
        </div>
      </div>

      <div>
        <div className="flex items-start justify-between gap-3">
          <h4 className="text-sm font-semibold">Cover letter draft</h4>
          <button
            type="button"
            className="btn btn-ghost btn-sm gap-2"
            onClick={copyDraft}
            disabled={!coverLetterDraft}
          >
            {copied ? (
              <>
                <Check className="h-4 w-4" /> Copied
              </>
            ) : (
              <>
                <Clipboard className="h-4 w-4" /> Copy
              </>
            )}
          </button>
        </div>
        <textarea
          className="textarea textarea-bordered mt-2 h-40 w-full resize-none"
          value={coverLetterDraft}
          readOnly
        />
      </div>

      <div>
        <h4 className="text-sm font-semibold">Top priorities</h4>
        <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-base-content/80">
          {topPriorities.length ? (
            topPriorities.map((item, idx) => <li key={`${item}-${idx}`}>{item}</li>)
          ) : (
            <li>No priorities listed.</li>
          )}
        </ol>
      </div>
    </div>
  )
}
