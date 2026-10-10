const STEPS = ['Seats', 'Checkout']

const StepTabs = ({ step }: { step: 1 | 2 }) => (
  <ol className='flex rounded-full bg-card'>
    {STEPS.map((label, i) => (
      <li
        key={label}
        aria-current={i + 1 === step ? 'step' : undefined}
        className={`flex-1 rounded-full py-2.5 text-center text-label-s uppercase ${i + 1 === step ? 'bg-brand text-fg' : 'text-muted'}`}>
        {label}
      </li>
    ))}
  </ol>
)

export default StepTabs