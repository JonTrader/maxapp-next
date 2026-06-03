const DAILY_GOAL = 20

export default function DailyProgressBar({ todayCount }: { todayCount: number }) {
  return (
    <div className="mt-6 rounded-lg border border-base-200 bg-base-100 p-4">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-sm font-semibold">Today&apos;s Applications</h3>
        <span className="text-sm font-bold text-primary">{todayCount}/{DAILY_GOAL}</span>
      </div>
      <progress
        className="progress progress-primary w-full"
        value={todayCount}
        max={DAILY_GOAL}
      ></progress>
    </div>
  )
}
