'use client'

import React from 'react'
import { motion } from 'motion/react'
import { CalendarDays } from 'lucide-react'

type TripDurationUiProps = {
  onSelectOption: (value: string) => void
}

const durationOptions = [
  { label: '1 Day', value: '1 day', icon: '☀️' },
  { label: '3 Days', value: '3 days', icon: '🏕️' },
  { label: '5 Days', value: '5 days', icon: '🌊' },
  { label: '7 Days', value: '7 days', icon: '🏔️' },
  { label: '10 Days', value: '10 days', icon: '🗺️' },
  { label: '14 Days', value: '14 days', icon: '🌍' },
]

const TripDurationUi = ({ onSelectOption }: TripDurationUiProps) => {
  return (
    <div className='flex flex-wrap gap-2 mt-2'>
      {durationOptions.map((item, index) => (
        <motion.button
          key={index}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.05 }}
          onClick={() => onSelectOption(item.value)}
          className='flex items-center gap-2 px-4 py-2 border rounded-xl bg-white hover:border-primary hover:text-primary active:scale-95 transition-all text-sm font-medium shadow-sm'
        >
          <span>{item.icon}</span>
          {item.label}
        </motion.button>
      ))}
      <div className="w-full mt-2">
         <p className="text-[10px] text-gray-400 flex items-center gap-1">
           <CalendarDays className="w-3 h-3" /> or type any number of days
         </p>
      </div>
    </div>
  )
}

export default TripDurationUi
