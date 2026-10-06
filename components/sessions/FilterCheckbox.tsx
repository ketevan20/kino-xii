type Props = { label: string; hint?: string; checked: boolean; onChange: () => void }

const FilterCheckbox = ({ label, hint, checked, onChange }: Props) => (
  <label className='group flex cursor-pointer items-center gap-2.5'>
    <input type='checkbox' checked={checked} onChange={onChange} className='peer sr-only' />
    <span className='grid size-4.5 shrink-0 place-items-center rounded border-[1.5px] border-subtle transition peer-checked:border-brand peer-checked:bg-brand peer-focus-visible:ring-2 peer-focus-visible:ring-brand/50'>
      <img src="/checked.svg" alt="check icon" className='size-2.5 text-fg opacity-0 group-has-checked:opacity-100'/>
    </span>
    <span className='text-label-m text-fg'>{label}{hint && <span className='ml-1.25 text-body-s text-muted'>· {hint}</span>}</span>
    
  </label>
)

export default FilterCheckbox