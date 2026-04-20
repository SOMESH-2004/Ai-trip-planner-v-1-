export type BudgetOption = {
  id: number
  title: string
  desc: string
  icon: string
}

export const BudgetOptionsList: BudgetOption[] = [
  {
    id: 1,
    title: 'Cheap',
    desc: 'Stay conscious of costs',
    icon: '💵',
  },
  {
    id: 2,
    title: 'Moderate',
    desc: 'Keep cost on average level',
    icon: '💰',
  },
  {
    id: 3,
    title: 'Luxury',
    desc: 'Dont worry about cost',
    icon: '💎',
  },
]
