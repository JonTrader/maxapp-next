import Link from 'next/link'
import ApplicationCard from '@/components/applications/ApplicationCard'
import type { ApplicationBucket, Status } from '@/lib/data'

type Props = {
  status: Status
  bucket: ApplicationBucket
}

export default function StatusColumn({ status, bucket }: Props) {
  const hasMore = bucket.total > bucket.items.length

  return (
    <section className="rounded-xl border border-base-200 bg-base-100 p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">{status}</h3>
        <span className="text-xs text-base-content/60">
          {bucket.total} applications
        </span>
      </div>

      <div className="mt-4 space-y-3">
        {bucket.items.map((application) => (
          <ApplicationCard key={application._id} application={application} />
        ))}
        {bucket.items.length === 0 && (
          <div className="rounded-xl border border-dashed border-base-200 bg-base-100 p-4 text-sm text-base-content/70">
            No applications yet.
          </div>
        )}
        {hasMore && (
          <Link
            href={`/jobapplications/status/${status}`}
            className="block text-center text-xs text-primary hover:underline"
          >
            View all {bucket.total} →
          </Link>
        )}
      </div>
    </section>
  )
}
