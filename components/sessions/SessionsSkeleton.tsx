import Skeleton from '@/components/ui/Skeleton'

const SessionsSkeleton = () => (
    <div role='status' aria-label='Loading sessions' className='flex flex-col gap-9 mt-[117.5px] px-12.75 overflow-hidden'>
        <div className='flex flex-col gap-2'>
            <Skeleton className='h-5 w-40' />
            <Skeleton className='h-5 w-52' />
        </div>

        <div className='flex gap-12.75'>
            <Skeleton className='w-[320px] h-271.25' />

            <div className='flex flex-col gap-2'>
                <div className='mb-4 flex items-center justify-between'>
                    <Skeleton className='h-5 w-40' />
                    <Skeleton className='h-5 w-48' />
                </div>
                {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className='flex flex-col gap-4 py-6'>
                        <div className='flex items-center gap-4'>
                            <Skeleton className='h-16 w-11' />
                            <div className='flex flex-col gap-2'>
                                <Skeleton className='h-5 w-48' />
                                <Skeleton className='h-4 w-20' />
                            </div>
                        </div>
                        <div className='flex gap-3 overflow-hidden'>
                            {Array.from({ length: 5 }).map((_, j) => (
                                <Skeleton key={j} className='h-24 w-40 shrink-0 rounded-xl' />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>

        <span className='sr-only'>Loading sessions…</span>
    </div>
)

export default SessionsSkeleton