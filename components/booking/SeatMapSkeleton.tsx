import Skeleton from '@/components/ui/Skeleton'

const SeatMapSkeleton = () => (
    <div role='status' aria-label='Loading seats' className='w-full h-full my-5 flex flex-col gap-6'>
        <Skeleton className='h-8 w-full' />
        <div className='mx-auto flex flex-col gap-2'>
            {Array.from({ length: 9 }).map((_, r) => (
                <div key={r} className='flex gap-2'>
                    {Array.from({ length: 10 }).map((_, s) => (
                        <Skeleton key={s} className='size-9.5' />
                    ))}
                </div>
            ))}
        </div>
    </div>
)

export default SeatMapSkeleton