export default function Loading() {
  return (
    <div className="min-h-screen bg-base-200">
      <main className="mx-auto max-w-7xl px-4 py-8">
        {/* Header Skeleton */}
        <div className="mb-6 flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-8 w-48 rounded-md bg-base-300 animate-pulse"></div>
            <div className="h-4 w-32 rounded-md bg-base-300 animate-pulse"></div>
          </div>
          <div className="h-8 w-32 rounded-md bg-base-300 animate-pulse"></div>
        </div>

        {/* Cards Skeleton Grid */}
        <div className="grid gap-4 sm:grid-cols-4 xl:grid-cols-5">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="card w-full border border-base-200 bg-base-100 p-4 shadow-sm">
              <div className="space-y-3">
                <div className="h-5 w-3/4 rounded bg-base-300 animate-pulse"></div>
                <div className="h-4 w-1/2 rounded bg-base-300 animate-pulse"></div>
                <div className="mt-4 flex justify-between">
                  <div className="h-4 w-1/3 rounded bg-base-300 animate-pulse"></div>
                  <div className="h-4 w-1/3 rounded bg-base-300 animate-pulse"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
