import { redirect } from 'next/navigation'
import { ChevronLeft, ExternalLink } from 'lucide-react'
import AIAnalysisPanel from '@/components/applications/AIAnalysisPanel'
import { getSession } from '@/lib/auth/auth'
import DeleteApplicationModal from '@/components/applications/DeleteApplicationModal'
import Link from 'next/link'
import ApplicationStatusUpdater from '@/components/applications/ApplicationStatusUpdater'
import { getApplication } from '@/lib/data'
import RunAnalysisButton from '@/components/applications/RunAnalysisButton'

export default async function ApplicationPage(props: { params: Promise<{ id: string }> }) {
    const session = await getSession()
    if (!session) redirect("/login")

    const params = await props.params
    const { id: applicationId } = params

    const application = await getApplication(applicationId, session?.user.id)
    if (!application) {
        return null
    }

    const appliedDate = (date: string | Date | undefined) => {
        if (!date) return null
        const organizedDate = new Date(date)
        return organizedDate.toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })
    }

    return (
        <div className="min-h-screen bg-base-200">
            <main className="mx-auto max-w-5xl px-4 py-8">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="space-y-2">
                        <Link
                            href="/jobapplications"
                            className="btn gap-2 btn-primary hover:border-white"
                        >
                            <ChevronLeft className="h-4 w-4" />
                            Back to Dashboard
                        </Link>
                        <div className='mt-6'>
                            <h1 className='text-xl'>{application.company}</h1>
                            <p className="text-sm text-base-content/60">{application.role}</p>
                            <div className="mt-2 flex flex-wrap items-center gap-2">
                                {application.location && (
                                    <span className="badge badge-outline">{application.location}</span>
                                )}
                                {appliedDate && (
                                    <span className="badge badge-outline">Applied {appliedDate(application?.appliedDate)}</span>
                                )}
                                {application.resumeFilename && (
                                    <span className="badge badge-outline">{application.resumeFilename}</span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 md:justify-end">
                        {application.jobUrl && (
                            <a
                                href={application.jobUrl.startsWith('http') ? application.jobUrl : `https://${application.jobUrl}`}
                                target="_blank"
                                rel="noreferrer"
                                className="btn btn-outline btn-sm gap-2"
                            >
                                <ExternalLink className="h-4 w-4" />
                                View Job Posting
                            </a>
                        )}
                    <DeleteApplicationModal
                        applicationId={applicationId}
                        status={application.status}
                    />
                    </div>
                </div>

                <section className="mt-6 rounded-xl border border-base-200 bg-base-100 p-6">
                    <h2 className="text-lg font-semibold">Update Status</h2>
                    <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-center md:gap-6">
                        <ApplicationStatusUpdater
                            applicationId={String(application._id)}
                            initialStatus={application.status}
                        />
                    </div>
                </section>

                <section className="mt-6 rounded-xl border border-base-200 bg-base-100 p-6">
                    <h2 className="text-lg font-semibold">Notes</h2>
                    <p className="mt-3 whitespace-pre-wrap text-sm text-base-content/80">
                        {application.notes || 'No notes are available'}
                    </p>
                </section>

                <section className="mt-6 rounded-xl border border-base-200 bg-base-100 p-6">
                    <h2 className="text-lg font-semibold">Job Description</h2>
                    <p className="mt-3 whitespace-pre-wrap text-sm text-base-content/80">
                        {application.jobDescription || 'No job description available.'}
                    </p>
                </section>

                <section className="mt-6 rounded-xl border border-base-200 bg-base-100 p-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold">AI Analysis</h2>
                        <RunAnalysisButton
                            applicationId={application._id}
                            hasAnalysis={!!application.aiAnalysis && Object.keys(application.aiAnalysis).length > 0}
                        />
                    </div>
                    <div className="mt-4">
                        <AIAnalysisPanel analysis={application.aiAnalysis} />
                    </div>
                </section>
            </main>
        </div>
    )
}
