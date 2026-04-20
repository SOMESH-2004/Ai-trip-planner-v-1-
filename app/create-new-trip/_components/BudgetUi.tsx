import React from 'react'
import { BudgetOptionsList } from '../_data/budgetOptions'
import { motion } from 'motion/react'

type BudgetUiProps = {
  onSelectOption: (value: string) => void
}

const BudgetUi = ({ onSelectOption }: BudgetUiProps) => {
  return (
    <div className='grid grid-cols-1 sm:grid-cols-3 gap-3 items-center mt-2'>
      {BudgetOptionsList.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className='p-4 border rounded-2xl bg-white hover:border-primary active:scale-95 transition-all cursor-pointer shadow-sm hover:shadow-md h-full'
          onClick={() => onSelectOption(item.title)}
        >
          <div className='text-2xl mb-1'>{item.icon}</div>
          <h2 className='font-bold text-sm'>{item.title}</h2>
          <p className='text-xs text-gray-500 line-clamp-2'>{item.desc}</p>
        </motion.div>
      ))}
    </div>
  )
}

export default BudgetUi
