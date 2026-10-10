const STEPS = ['Seats', 'Checkout']

const StepTabs = ({ step, onBack }: { step: 1 | 2; onBack?: () => void }) => (
  <ol className='flex rounded-full bg-card'>
    {STEPS.map((label, i) => {
      const active = i + 1 === step
      const base = 'w-full rounded-full py-2.5 text-center text-label-s uppercase'

      return (
        <li key={label} aria-current={active ? 'step' : undefined} className='flex-1'>
          {i === 0 && step === 2 && onBack ? (
            <button type='button' onClick={onBack} className={`${base} text-muted hover:text-fg`}>
              {label}
            </button>
          ) : (
            <span className={`block ${base} ${active ? 'bg-brand text-fg' : 'text-muted'}`}>
              {label}
            </span>
          )}
        </li>
      )
    })}
  </ol>
)

export default StepTabs