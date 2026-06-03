"use client"

import { useOptimistic, useTransition, type ChangeEvent } from 'react'
import { toast } from 'sonner'
import { updateApplicationStatus } from '@/lib/actions/applications'
import { STATUS_OPTIONS, type Status } from '@/lib/constants'

type Props = {
  applicationId: string
  initialStatus: Status
  statusOptions?: readonly Status[]
}

export default function ApplicationStatusUpdater({
  applicationId,
  initialStatus,
  statusOptions = STATUS_OPTIONS,
}: Props) {
  const [isPending, startTransition] = useTransition()
  const [status, setOptimisticStatus] = useOptimistic<Status, Status>(
    initialStatus,
    (_current, next) => next,
  )

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const next = e.target.value as Status
    startTransition(async () => {
      setOptimisticStatus(next)
      const result = await updateApplicationStatus(applicationId, next)
      if (result.ok) {
        toast.success('Status updated')
      } else {
        toast.error(result.message)
      }
    })
  }

  return (
    <select
      name="status"
      value={status}
      onChange={handleChange}
      disabled={isPending}
      className="select select-bordered max-w-xs"
    >
      {statusOptions.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  )
}
