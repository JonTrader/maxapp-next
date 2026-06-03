import Link from 'next/link'

type PaginationProps = {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

type Props = {
  pagination: PaginationProps
  baseUrl: string
  itemsLength: number
}

export default function PaginationControls({ pagination, baseUrl, itemsLength }: Props) {
  return (
    <div className="mt-6 flex items-center justify-between">
      <Link
        href={`${baseUrl}?page=${pagination.page - 1}`}
        className={`btn btn-outline btn-sm ${!pagination.hasPrev ? 'pointer-events-none opacity-50' : ''}`}
        aria-disabled={!pagination.hasPrev}
      >
        Previous
      </Link>

      <span className="text-sm text-base-content/70">
        {pagination.total === 0
          ? 'Showing 0 of 0'
          : `Showing ${(pagination.page - 1) * pagination.limit + 1}-${
              (pagination.page - 1) * pagination.limit + itemsLength
            } of ${pagination.total}`}
      </span>

      <Link
        href={`${baseUrl}?page=${pagination.page + 1}`}
        className={`btn btn-outline btn-sm ${!pagination.hasNext ? 'pointer-events-none opacity-50' : ''}`}
        aria-disabled={!pagination.hasNext}
      >
        Next
      </Link>
    </div>
  )
}
