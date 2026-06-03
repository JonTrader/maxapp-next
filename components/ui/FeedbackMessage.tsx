type Props = {
  type?: 'default' | 'error' | 'empty'
  message: string
}

export default function FeedbackMessage({ type = 'default', message }: Props) {
  let styleClasses = 'border-base-200 bg-base-100 text-base-content/70'

  if (type === 'error') {
    styleClasses = 'border-error bg-error/10 text-error'
  } else if (type === 'empty') {
    styleClasses = 'border-base-200 bg-base-50 text-base-content/70'
  }

  return (
    <div className={`rounded-xl border border-dashed p-6 text-sm ${styleClasses}`}>
      {message}
    </div>
  )
}
