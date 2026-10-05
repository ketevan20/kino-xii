const variants = {
  neutral: 'bg-fg/10 text-fg',
  brand: 'bg-brand/10 text-brand',
  success: 'bg-success/10 text-success',
  warning: 'bg-warning/10 text-warning',
  elevated: 'bg-elevated text-muted',
} as const

type BadgeProps = {
  children: React.ReactNode
  variant?: keyof typeof variants
  icon?: string 
  className?: string
}

const Badge = ({ children, variant = 'neutral', icon, className = '' }: BadgeProps) => (
  <span
    className={`text-label-s inline-flex w-fit items-center gap-1 rounded-full px-2.5 py-1.5 ${variants[variant]} ${className}`}
  >
    {icon && <img src={icon} alt='' className='size-3 shrink-0' />}
    {children}
  </span>
)

export default Badge