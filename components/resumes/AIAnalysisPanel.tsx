"use client";

import { useMemo } from 'react'

interface SectionScore {
  score?: number
  recommendations?: string[]
}

interface AtsCompatibility extends SectionScore {
  present_keywords?: string[]
  missing_keywords?: string[]
}

interface GapsAndFlags {
  flags?: string[]
  recommendations?: string[]
}

interface AIAnalysisProps {
  overall_score?: number
  overall_summary?: string
  relevance?: SectionScore
  impact_and_quantification?: SectionScore
  ats_compatibility?: AtsCompatibility
  gaps_and_red_flags?: GapsAndFlags
  top_3_priorities?: string[]
  competitive_assessment?: string
}

export default function AIAnalysisPanel({ analysis }: { analysis: AIAnalysisProps }) {
  const overallScore = analysis?.overall_score ?? 0
  const overallSummary = analysis?.overall_summary ?? ''
  const relevance = analysis?.relevance ?? {}
  const impact = analysis?.impact_and_quantification ?? {}
  const ats = analysis?.ats_compatibility ?? {}
  const gaps = analysis?.gaps_and_red_flags ?? {}
  const topPriorities = analysis?.top_3_priorities ?? []
  const competitiveAssessment = analysis?.competitive_assessment ?? ''

  const showEmpty = !analysis || Object.keys(analysis).length === 0

  const clampScore = (val?: number) => {
    const num = Number(val ?? 0)
    if (Number.isNaN(num)) return 0
    return Math.max(0, Math.min(100, num))
  }

  const overallScorePct = useMemo(() => clampScore(overallScore), [overallScore])
  const relevanceScore = useMemo(() => clampScore(relevance.score), [relevance.score])
  const impactScore = useMemo(() => clampScore(impact.score), [impact.score])
  const atsScore = useMemo(() => clampScore(ats.score), [ats.score])

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
          <span className="text-sm text-base-content/60">Overall Score</span>
        </div>
        <div className="mt-2 flex items-center gap-3">
          <div className="h-2 w-full overflow-hidden rounded-full bg-base-200">
            <div
              className="h-full rounded-full bg-success"
              style={{ width: `${overallScorePct}%` }}
            />
          </div>
          <span className="text-sm font-semibold">{overallScorePct}%</span>
        </div>
        {overallSummary && <p className="mt-3 text-sm text-base-content/80">{overallSummary}</p>}
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold">Relevance</h4>
            <span className="text-xs text-base-content/60">{relevanceScore}%</span>
          </div>
          <ul className="list-disc space-y-1 pl-4 text-sm text-base-content/80">
            {(relevance.recommendations ?? []).length ? (
              relevance.recommendations!.map((rec, idx) => <li key={`${rec}-${idx}`}>{rec}</li>)
            ) : (
              <li>No recommendations.</li>
            )}
          </ul>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold">Impact & Quantification</h4>
            <span className="text-xs text-base-content/60">{impactScore}%</span>
          </div>
          <ul className="list-disc space-y-1 pl-4 text-sm text-base-content/80">
            {(impact.recommendations ?? []).length ? (
              impact.recommendations!.map((rec, idx) => <li key={`${rec}-${idx}`}>{rec}</li>)
            ) : (
              <li>No recommendations.</li>
            )}
          </ul>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold">ATS Compatibility</h4>
            <span className="text-xs text-base-content/60">{atsScore}%</span>
          </div>
          <div className="mt-1 text-sm text-base-content/70">Present keywords</div>
          <div className="flex flex-wrap gap-2">
            {(ats.present_keywords ?? []).length ? (
              ats.present_keywords!.map((keyword, idx) => (
                <span key={`${keyword}-${idx}`} className="badge badge-outline badge-sm max-w-50 truncate">
                  {keyword}
                </span>
              ))
            ) : (
              <span className="text-sm text-base-content/60">None listed.</span>
            )}
          </div>
          <div className="mt-2 text-sm font-medium">Missing keywords</div>
          <div className="flex flex-wrap gap-2">
            {(ats.missing_keywords ?? []).length ? (
              ats.missing_keywords!.map((keyword, idx) => (
                <span key={`${keyword}-${idx}`} className="badge badge-outline badge-sm badge-warning text-warning max-w-50 truncate">
                  {keyword}
                </span>
              ))
            ) : (
              <span className="text-sm text-base-content/60">No missing keywords detected.</span>
            )}
          </div>
          <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-base-content/80">
            {(ats.recommendations ?? []).length ? (
              ats.recommendations!.map((rec, idx) => <li key={`${rec}-${idx}`}>{rec}</li>)
            ) : (
              <li>No recommendations.</li>
            )}
          </ul>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <h4 className="text-sm font-semibold">Top 3 priorities</h4>
          <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-base-content/80">
            {topPriorities.length ? (
              topPriorities.map((item, idx) => <li key={`${item}-${idx}`}>{item}</li>)
            ) : (
              <li>No priorities listed.</li>
            )}
          </ol>
        </div>

        <div>
          <h4 className="text-sm font-semibold">Gaps & Red Flags</h4>
          <div className="mt-2 text-sm font-medium text-base-content/70">Flags</div>
          <ul className="list-disc space-y-1 pl-5 text-sm text-base-content/80">
            {(gaps.flags ?? []).length ? (
              gaps.flags!.map((flag, idx) => <li key={`${flag}-${idx}`}>{flag}</li>)
            ) : (
              <li>No flags identified.</li>
            )}
          </ul>
          <div className="mt-3 text-sm font-medium text-base-content/70">Recommendations</div>
          <ul className="list-disc space-y-1 pl-5 text-sm text-base-content/80">
            {(gaps.recommendations ?? []).length ? (
              gaps.recommendations!.map((rec, idx) => <li key={`${rec}-${idx}`}>{rec}</li>)
            ) : (
              <li>No recommendations.</li>
            )}
          </ul>
        </div>
      </div>

      <div>
        <h4 className="text-sm font-semibold">Competitive assessment</h4>
        <p className="mt-2 text-sm text-base-content/80">
          {competitiveAssessment || 'No assessment yet.'}
        </p>
      </div>
    </div>
  )
}
