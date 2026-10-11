const Skeleton = ({ className = '' }: { className?: string }) => (
    <div aria-hidden='true' className={`animate-pulse rounded-lg bg-elevated ${className}`} />
)

export default Skeleton