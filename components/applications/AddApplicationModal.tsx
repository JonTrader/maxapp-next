"use client";

import { useMemo, useState, type ChangeEvent } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { LoaderCircle, Plus } from 'lucide-react'
import type { Status } from '@/lib/data'
import { createApplication, runApplicationAnalysis } from '@/lib/actions/applications'

type FormState = {
  company: string
  role: string
  status: Status
  appliedDate: string
  location: string
  notes: string
  jobDescription: string
  jobUrl: string
  resume: File | null
  runAnalysis: boolean
}

type TextFieldKey = Exclude<keyof FormState, 'resume' | 'runAnalysis'>

const defaultState: FormState = {
  company: '',
  role: '',
  status: 'Applied',
  appliedDate: '',
  location: '',
  notes: '',
  jobDescription: '',
  jobUrl: '',
  resume: null,
  runAnalysis: false,
}

const getTodayDate = () => {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export default function AddApplicationModal() {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState(defaultState)
  const [resumeError, setResumeError] = useState('')

  const [isSaving, setIsSaving] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const router = useRouter()

  const handleOpenModal = () => {
    setForm({ ...defaultState, appliedDate: getTodayDate() })
    setOpen(true)
  }

  const handleCloseModal = () => {
    setOpen(false)
  }

  const handleSubmit = async (formData: FormData) => {
    setIsSaving(true)
    setIsAnalyzing(false)

    // Ensure the runAnalysis choice is sent with the form payload
    formData.set('runAnalysis', String(form.runAnalysis))

    try {
      const result = await createApplication(
        { ok: false, message: '', applicationId: '' },
        formData,
      )

      if (!result.ok) {
        toast.error(result.message || 'Something went wrong')
        return
      }

      toast.success('Application added')

      if (form.runAnalysis) {
        setIsSaving(false)
        setIsAnalyzing(true)

        const analysisResult = await runApplicationAnalysis(result.applicationId)
        if (!analysisResult.ok) {
          toast.error(analysisResult.message || 'AI analysis failed')
        } else {
          toast.success('AI analysis completed')
        }
      }

      router.push(`/jobapplications/${result.applicationId}`)
      setOpen(false)
      setForm({ ...defaultState, appliedDate: getTodayDate() })
    } catch {
      toast.error('Something went wrong')
    } finally {
      setIsSaving(false)
      setIsAnalyzing(false)
    }
  }

  const canSubmit = useMemo(() => {
    return (
      form.company.trim() &&
      form.role.trim() &&
      form.jobDescription &&
      form.resume &&
      !resumeError
    )
  }, [form.company, form.role, form.jobDescription, form.resume, resumeError])

  // Written like this to avoid writing a seperate handler for every field. This returns a function usable for handleChange for outer function.
  const handleChange =
    (key: TextFieldKey) =>
      (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const value = event.target.value
        setForm((prev) => ({ ...prev, [key]: value }))
      }

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null
    if (!file) {
      setResumeError('')
      setForm((prev) => ({ ...prev, resume: null }))
      return
    }

    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')
    if (!isPdf) {
      setResumeError('Only PDF files are accepted')
      setForm((prev) => ({ ...prev, resume: null }))
      event.target.value = ''
      return
    }

    setResumeError('')
    setForm((prev) => ({ ...prev, resume: file }))
  }

  const handleToggle = () => {
    setForm((prev) => ({ ...prev, runAnalysis: !prev.runAnalysis }))
  }

  return (
    <>
      <button
        type="button"
        className="btn btn-primary hover:border-white gap-2"
        onClick={handleOpenModal}
      >
        <Plus className="h-4 w-4" />
        Add Application
      </button>

      {open && (
        <div className="modal modal-open">
          <div className="modal-box relative max-w-2xl">
            <button
              type="button"
              className="btn btn-sm btn-ghost btn-circle absolute right-3 top-3"
              onClick={handleCloseModal}
            >
              ✕
            </button>
            <h2 className="text-xl font-semibold">Add New Application</h2>
            <form className="mt-4 space-y-4" action={handleSubmit}>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="input-group">
                  <span className="w-32">Company *</span>
                  <input
                    name="company"
                    value={form.company}
                    onChange={handleChange('company')}
                    type="text"
                    placeholder="e.g. Acme Corp"
                    className="input input-bordered w-full"
                  />
                </label>
                <label className="input-group">
                  <span className="w-32">Role *</span>
                  <input
                    name="role"
                    value={form.role}
                    onChange={handleChange('role')}
                    type="text"
                    placeholder="e.g. Product Designer"
                    className="input input-bordered w-full"
                  />
                </label>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="input-group">
                  <span className="w-32">Status</span>
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange('status')}
                    className="select select-bordered w-full"
                  >
                    <option>Saved</option>
                    <option>Applied</option>
                    <option>Interview</option>
                    <option>Offer</option>
                    <option>Rejected</option>
                  </select>
                </label>
                <label className="input-group">
                  <span className="w-32">Date Applied</span>
                  <input
                    name="appliedDate"
                    value={form.appliedDate}
                    onChange={handleChange('appliedDate')}
                    type="date"
                    className="input input-bordered w-full"
                  />
                </label>
              </div>

              <label className="input-group">
                <span className="w-32">Location</span>
                <input
                  name="location"
                  value={form.location}
                  onChange={handleChange('location')}
                  type="text"
                  placeholder="e.g. San Francisco, CA"
                  className="input input-bordered w-full"
                />
              </label>

              <div className='mt-4'>
                <label className="input-group">
                  <span className="w-32">Notes</span>
                  <textarea
                    name="notes"
                    value={form.notes}
                    onChange={handleChange('notes')}
                    className="textarea textarea-bordered w-full"
                    placeholder="Optional notes about this role"
                    rows={3}
                  />
                </label>
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-2 grid-flow-col">
                <label className="row-span-3 input-group">
                  <span className="w-32">Job description *</span>
                  <textarea
                    name="jobDescription"
                    value={form.jobDescription}
                    onChange={handleChange('jobDescription')}
                    className="textarea textarea-bordered w-full"
                    placeholder="Paste the job description here..."
                    rows={4}
                  />
                </label>
                <label className="input-group">
                  <span className="w-32">Job Application URL</span>
                  <input
                    name="jobUrl"
                    value={form.jobUrl}
                    onChange={handleChange('jobUrl')}
                    type="text"
                    placeholder="https://joburl.com/job"
                    className="input input-bordered w-full"
                  />
                </label>
                <label className="form-control w-full">
                  <div className="label">
                    <span className="label-text text-sm">Resume (PDF) *</span>
                  </div>
                  <input
                    name="resume"
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="file-input file-input-bordered w-full"
                  />
                  <div className="label">
                    {resumeError ? (
                      <span className="label-text-alt text-xs text-error">{resumeError}</span>
                    ) : form.resume ? (
                      <span className="label-text-alt text-xs text-success">✓ {form.resume.name}</span>
                    ) : (
                      <span className="label-text-alt text-xs">Only PDF files are accepted</span>
                    )}
                  </div>
                </label>
              </div>

              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.runAnalysis}
                  onChange={handleToggle}
                  className="checkbox"
                />
                Run AI analysis after saving
              </label>

              <div className="mt-4 flex flex-col items-end gap-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={handleCloseModal}
                  disabled={isSaving || isAnalyzing}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={!canSubmit || isSaving || isAnalyzing}>
                  {isSaving
                    ? 'Saving…'
                    : isAnalyzing
                      ? (
                        <>
                          Analyzing
                          <LoaderCircle className="h-4 w-4 animate-spin" />
                        </>
                      )
                      : 'Add Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
