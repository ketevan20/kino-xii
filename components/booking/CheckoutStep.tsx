import type { ListSession, SeatHold } from '@/types/api'
import OrderSummary from './OrderSummary'
import StepTabs from './StepTabs'

type Props = { session: ListSession; hold: SeatHold; onBack: () => void }

const CheckoutStep = ({ session, hold, onBack }: Props) => (
    <div className='grid grid-cols-[minmax(0,1fr)_380px] gap-5'>
        <div className='flex flex-col gap-6'>
            <StepTabs step={2} onBack={onBack} />
            <p className='text-body-m text-muted'>Checkout</p>
        </div>
        <OrderSummary session={session} hold={hold} />
    </div>
)

export default CheckoutStep