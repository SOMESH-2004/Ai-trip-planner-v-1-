import React from 'react'
import { SelectTravelesList } from '../_data/groupSizeOptions'
import { motion } from 'motion/react'

type GroupSizeUiProps = {
  onSelectOption: (value: string) => void
}

const GroupSizeUi = ({ onSelectOption }: GroupSizeUiProps) => {
  return (
    <div className='grid grid-cols-2 lg:grid-cols-4 gap-2 items-center mt-2'>
      {SelectTravelesList.map((item,index) =>(
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.05 }}
          className='p-3 border rounded-2xl bg-white hover:border-primary cursor-pointer active:scale-95 transition-all flex flex-col items-center text-center shadow-sm h-full group'
          onClick={() => onSelectOption(`${item.title}: ${item.people}`)}
        >
            <div className='text-2xl mb-1 group-hover:scale-110 transition-transform'>{item.icon}</div>
            <h2 className='font-bold text-xs'>{item.title}</h2>
            <p className='text-[10px] text-gray-400'>{item.people}</p>
        </motion.div>
      ))}
    </div>
  )
}

export default GroupSizeUi
