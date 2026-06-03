// Pure constants/types — safe to import from client components.
// Do NOT import anything from `mongoose` or `@/lib/db` here.

export const ROLE_SUGGESTIONS = [
  'Software Engineer',
  'Accountant',
  'Economist',
  'Project Manager',
  'Business Analyst',
  'Data Analyst'
]

export const STATUS_OPTIONS = [
    'Applied',
    'Interview',
    'Offer',
    'Rejected',
    'Saved',
] as const

export type Status = (typeof STATUS_OPTIONS)[number]
export type StatusKey = Lowercase<Status>

export function normalizeStatus(status: string): Status | null {
    const normalized = status.trim().toLowerCase()
    return STATUS_OPTIONS.find((s) => s.toLowerCase() === normalized) || null
}
