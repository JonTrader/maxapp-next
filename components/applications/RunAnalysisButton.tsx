"use client";

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { LoaderCircle, Sparkles } from 'lucide-react'
import { runApplicationAnalysis } from '@/lib/actions/applications'

interface Props {
  applicationId: string
  hasAnalysis: boolean
}

export default function RunAnalysisButton({ applicationId, hasAnalysis }: Props) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleRun = async () => {
    setLoading(true)
    try {
      const result = await runApplicationAnalysis(applicationId)
      if (!result.ok) {
        toast.error(result.message || 'AI analysis failed')
        return
      }
      toast.success('AI analysis completed')
      router.refresh()
    } catch (error) {
      console.error(error)
      toast.error('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  if (hasAnalysis) return null

  return (
    <button
      type="button"
      className="btn btn-sm btn-primary gap-2"
      onClick={handleRun}
      disabled={loading}
    >
      <Sparkles className="h-4 w-4" />
      {loading ? ( <>Analyzing<LoaderCircle className="h-4 w-4 animate-spin" /> </> ) : 'Run Analysis'}
    </button>
  )
}
