"use client";

import { useActionState, useMemo, useState } from 'react'
import { ChevronLeft, Loader, Upload } from 'lucide-react'
import Link from 'next/link'
import { MAX_RESUME_FILE_SIZE_BYTES, ROLE_SUGGESTIONS } from '@/lib/constants'
import { createResume } from '@/lib/actions/resume'

const createResumeInitialState = { ok: false, message: '', resumeId: '' }

export default function CreateResumePage() {
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [fileError, setFileError] = useState('')
  const [selectedRole, setSelectedRole] = useState('')
  const [customRole, setCustomRole] = useState('')

  const [state, formAction, isPending] = useActionState(createResume, createResumeInitialState)

  const targetRole = useMemo(() => {
    const typedRole = customRole.trim()
    return typedRole || selectedRole
  }, [customRole, selectedRole])

  const canAnalyze = Boolean(resumeFile && targetRole)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null
    setFileError('')

    if (!file) {
      setResumeFile(null)
      return
    }

    if (file.type !== 'application/pdf') {
      setFileError('Only PDF files are allowed')
      setResumeFile(null)
      event.target.value = ''
      return
    }

    if (file.size > MAX_RESUME_FILE_SIZE_BYTES) {
      setFileError(
        `File is too large (${(file.size / 1024 / 1024).toFixed(2)}MB). Maximum size is ${MAX_RESUME_FILE_SIZE_BYTES / 1024 / 1024}MB.`,
      )
      setResumeFile(null)
      event.target.value = ''
      return
    }

    setResumeFile(file)
  }

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
              <h1 className="text-2xl font-semibold">Upload New Resume</h1>
              <p className="mt-2 text-sm text-base-content/70">
                Upload a PDF and run AI analysis for the role you want to target.
              </p>
            </div>
          </div>
        </div>

        <section className="mt-6 rounded-xl border border-base-200 bg-base-100 p-6">
          <div className="grid gap-6 md:grid-cols-2">
            <form className="flex flex-col gap-6" action={formAction}>
              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text text-sm font-medium">Resume PDF</span>
                </div>
                <input
                  name="resume"
                  type="file"
                  accept="application/pdf,.pdf"
                  onChange={handleFileChange}
                  className={`file-input file-input-bordered w-full ${fileError ? 'file-input-error' : ''}`}
                />
                <div className="label">
                  <span className={`label-text-alt text-xs ${fileError ? 'text-error' : 'text-base-content/60'}`}>
                    {fileError || 'Max file size: 5MB (PDF only)'}
                  </span>
                </div>
              </label>

              {resumeFile && (
                <div className="rounded-lg border border-success/30 bg-success/5 p-3 text-sm">
                  <div>
                    <p className="font-medium text-success">File selected</p>
                    <p className="mt-1 text-base-content/80">{resumeFile.name}</p>
                    <p className="text-xs text-base-content/60">{(resumeFile.size / 1024).toFixed(1)}KB</p>
                  </div>
                </div>
              )}

              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text text-sm font-medium">Role Suggestion</span>
                  {selectedRole && <span className="label-text-alt text-xs text-success">Selected</span>}
                </div>
                <select
                  value={selectedRole}
                  onChange={(event) => {
                    setSelectedRole(event.target.value)
                    if (event.target.value) setCustomRole('')
                  }}
                  className={`select select-bordered w-full ${selectedRole && !customRole ? 'select-success' : ''}`}
                >
                  <option value="">Choose a suggested role</option>
                  {ROLE_SUGGESTIONS.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </label>

              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text text-sm font-medium">Custom Role</span>
                  {customRole && <span className="label-text-alt text-xs text-success">In use</span>}
                </div>
                <input
                  type="text"
                  value={customRole}
                  onChange={(event) => {
                    setCustomRole(event.target.value)
                    if (event.target.value) setSelectedRole('')
                  }}
                  className={`input input-bordered w-full ${customRole ? 'input-success' : ''}`}
                  placeholder="e.g. Senior Backend Engineer"
                />
                <div className="label">
                  <span className="label-text-alt text-xs text-base-content/60">
                    Leave blank to use suggested role, or enter a custom one.
                  </span>
                </div>
              </label>

              <input type="hidden" name="targetRole" value={targetRole} />

              {!state.ok && state.message && (
                <div className="rounded-lg bg-error/10 p-3 text-sm text-error" role="alert">
                  {state.message}
                </div>
              )}

              <button
                type="submit"
                className="btn btn-primary gap-2 w-full"
                disabled={!canAnalyze || isPending}
                title={!resumeFile ? 'Please select a resume PDF' : !targetRole ? 'Please select or enter a target role' : ''}
              >
                {isPending ? (
                  <>
                    Analyzing
                    <Loader className="h-4 w-4 animate-spin" />
                  </>
                ) : (
                  <>
                    Analyze Resume
                    <Upload className="h-4 w-4" />
                  </>
                )}
              </button>

              {(!resumeFile || !targetRole) && (
                <div className="rounded-lg bg-warning/10 p-3 text-sm text-warning">
                  {!resumeFile && <p>• Select a resume PDF to begin</p>}
                  {!targetRole && <p>• Enter a target role (suggested or custom)</p>}
                </div>
              )}
            </form>

            <div className="rounded-xl border border-base-200 bg-base-100 p-4">
              <h2 className="text-lg font-semibold">New Resume Workflow</h2>
              <div className="mt-4 space-y-4 text-sm text-base-content/75">
                <p>Upload one PDF resume and pick the role you want the AI analysis to evaluate against.</p>
                <p>After analysis completes, this resume is saved to your library and you will land on its review page.</p>
                <p>To compare another resume later, return to the resume library and choose Upload New Resume again.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
