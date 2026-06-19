"use client";

import { useEffect, useMemo, useState, type ChangeEvent } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { LoaderCircle, Plus } from 'lucide-react'
import type { Status } from '@/lib/data'
import { createApplication, runApplicationAnalysis } from '@/lib/actions/applications'
import { getUserResumesForSelect } from '@/lib/actions/resume'

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

const formatResumeDate = (value?: string) => {
  if (!value) return ''
  return new Date(value).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

type ExistingResume = {
  _id: string
  originalFilename: string
  createdAt?: string
}

export default function AddApplicationModal() {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState(defaultState)
  const [resumeError, setResumeError] = useState('')

  const [resumeSource, setResumeSource] = useState<'upload' | 'existing'>('upload')
  const [existingResumeId, setExistingResumeId] = useState('')
  const [existingResumes, setExistingResumes] = useState<ExistingResume[]>([])
  const [existingResumesError, setExistingResumesError] = useState('')
  const [loadingResumes, setLoadingResumes] = useState(false)

  const [isSaving, setIsSaving] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const router = useRouter()

  const handleOpenModal = () => {
    setForm({ ...defaultState, appliedDate: getTodayDate() })
    setResumeSource('upload')
    setExistingResumeId('')
    setResumeError('')
    setExistingResumesError('')
    setOpen(true)
  }

  const handleCloseModal = () => {
    setOpen(false)
    setForm(defaultState)
    setResumeSource('upload')
    setExistingResumeId('')
    setExistingResumes([])
    setResumeError('')
    setExistingResumesError('')
  }

  useEffect(() => {
    if (!open) return

    let cancelled = false

    const loadResumes = async () => {
      setLoadingResumes(true)
      const result = await getUserResumesForSelect()

      if (cancelled) return

      if (result.ok) {
        setExistingResumes(result.items)
        setExistingResumesError('')
      } else {
        setExistingResumes([])
        setExistingResumesError(result.message || 'Could not load existing resumes')
      }

      setLoadingResumes(false)
    }

    loadResumes()

    return () => {
      cancelled = true
    }
  }, [open])

  const handleSubmit = async (formData: FormData) => {
    setIsSaving(true)
    setIsAnalyzing(false)

    // Ensure the runAnalysis choice is sent with the form payload
    formData.set('runAnalysis', String(form.runAnalysis))

    if (resumeSource === 'existing') {
      formData.delete('resume')
      formData.set('existingResumeId', existingResumeId)
    } else {
      formData.delete('existingResumeId')
    }

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
      handleCloseModal()
    } catch {
      toast.error('Something went wrong')
    } finally {
      setIsSaving(false)
      setIsAnalyzing(false)
    }
  }

  const canSubmit = useMemo(() => {
    const baseValid =
      form.company.trim() &&
      form.role.trim() &&
      form.jobDescription

    if (!baseValid) return false

    if (resumeSource === 'upload') {
      return !!form.resume && !resumeError
    }

    return !!existingResumeId
  }, [
    form.company,
    form.role,
    form.jobDescription,
    form.resume,
    resumeError,
    resumeSource,
    existingResumeId,
  ])

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

  const handleResumeSourceChange = (source: 'upload' | 'existing') => {
    setResumeSource(source)
    setResumeError('')
    setExistingResumesError('')
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
          <div className="modal-box relative max-w-2xl max-h-[90vh] flex flex-col">
            <button
              type="button"
              className="btn btn-sm btn-ghost btn-circle absolute right-3 top-3"
              onClick={handleCloseModal}
            >
              ✕
            </button>
            <h2 className="text-xl font-semibold mb-4">Add New Application</h2>
            <div className="flex-1 overflow-y-auto">
              <form className="space-y-4" action={handleSubmit}>
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
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

                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
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

                <div className="grid gap-4 grid-cols-1 lg:grid-cols-[1fr_280px]">
                  <label className="input-group lg:row-span-2">
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
                  <div className="flex flex-col gap-4">
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
                    <div className="form-control w-full">
                      <div className="label">
                        <span className="label-text text-sm">Resume *</span>
                      </div>

                      <div className="flex flex-col gap-2">
                        <label className="label cursor-pointer justify-start gap-2 py-1">
                          <input
                            type="radio"
                            name="resumeSource"
                            className="radio"
                            value="upload"
                            checked={resumeSource === 'upload'}
                            onChange={() => handleResumeSourceChange('upload')}
                          />
                          <span className="label-text">Upload a new resume</span>
                        </label>
                        <label className="label cursor-pointer justify-start gap-2 py-1">
                          <input
                            type="radio"
                            name="resumeSource"
                            className="radio"
                            value="existing"
                            checked={resumeSource === 'existing'}
                            onChange={() => handleResumeSourceChange('existing')}
                          />
                          <span className="label-text">Choose an existing resume</span>
                        </label>
                      </div>

                      {resumeSource === 'upload' ? (
                        <>
                          <input
                            name="resume"
                            type="file"
                            accept=".pdf"
                            onChange={handleFileChange}
                            className="file-input file-input-bordered w-full mt-2"
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
                        </>
                      ) : (
                        <>
                          <select
                            name="existingResumeId"
                            value={existingResumeId}
                            onChange={(e) => setExistingResumeId(e.target.value)}
                            className="select select-bordered w-full mt-2"
                            disabled={loadingResumes || existingResumes.length === 0}
                          >
                            <option value="">
                              {loadingResumes
                                ? 'Loading resumes…'
                                : existingResumes.length === 0
                                  ? 'No resumes found'
                                  : 'Choose a resume'}
                            </option>
                            {existingResumes.map((resume) => (
                              <option key={resume._id} value={resume._id}>
                                {resume.originalFilename}
                                {resume.createdAt ? ` • ${formatResumeDate(resume.createdAt)}` : ''}
                              </option>
                            ))}
                          </select>
                          <div className="label">
                            {existingResumesError ? (
                              <span className="label-text-alt text-xs text-error">{existingResumesError}</span>
                            ) : (
                              <span className="label-text-alt text-xs">
                                Select a resume from your library
                              </span>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
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

                <div className="mt-4 flex flex-col items-end gap-2 sm:flex-row sm:justify-end shrink-0 pt-2 border-t border-base-200 sticky bottom-0 bg-base-100 pb-2">
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
        </div>
      )}
    </>
  )
}
